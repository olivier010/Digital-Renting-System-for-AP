package com.backend.service;

import com.backend.dto.request.CreateBookingRequest;
import com.backend.dto.request.UpdateBookingRequest;
import com.backend.dto.response.BookingResponse;
import com.backend.dto.response.PageResponse;
import com.backend.entity.Booking;
import com.backend.entity.Property;
import com.backend.entity.User;
import com.backend.enums.BookingStatus;
import com.backend.enums.NotificationEntityType;
import com.backend.enums.NotificationType;
import com.backend.enums.PaymentStatus;
import com.backend.enums.Role;
import com.backend.exception.BadRequestException;
import com.backend.exception.ResourceNotFoundException;
import com.backend.exception.UnauthorizedException;
import com.backend.mapper.BookingMapper;
import com.backend.repository.BookingRepository;
import com.backend.repository.PropertyRepository;
import com.backend.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final PropertyRepository propertyRepository;
    private final BookingMapper bookingMapper;
    private final CurrentUser currentUser;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public PageResponse<BookingResponse> getAllBookings(BookingStatus status, LocalDate startDate, LocalDate endDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        User user = currentUser.getUser();
        Page<Booking> bookingPage;

        if (user.getRole() == Role.ADMIN) {
            bookingPage = bookingRepository.findByFilters(status, startDate, endDate, pageable);
        } else if (user.getRole() == Role.OWNER) {
            bookingPage = bookingRepository.findByOwnerIdAndStatus(user.getId(), status, pageable);
        } else {
            bookingPage = bookingRepository.findByRenterIdAndStatus(user.getId(), status, pageable);
        }
        return toPageResponse(bookingPage);
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));
        User user = currentUser.getUser();
        if (user.getRole() != Role.ADMIN &&
            !booking.getRenter().getId().equals(user.getId()) &&
            !booking.getProperty().getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedException("You don't have access to this booking");
        }
        return bookingMapper.toResponse(booking);
    }

    @Transactional(readOnly = true)
    public PageResponse<BookingResponse> getRenterBookings(Long renterId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Booking> bookingPage = bookingRepository.findByRenterId(renterId, pageable);
        return toPageResponse(bookingPage);
    }

    @Transactional(readOnly = true)
    public PageResponse<BookingResponse> getRenterBookings(Long renterId, int page, int size, String status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Booking> bookingPage;
        if (status != null && !status.isEmpty()) {
            BookingStatus bookingStatus;
            try {
                bookingStatus = BookingStatus.valueOf(status);
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid booking status: " + status);
            }
            bookingPage = bookingRepository.findByRenterIdAndStatus(renterId, bookingStatus, pageable);
        } else {
            bookingPage = bookingRepository.findByRenterId(renterId, pageable);
        }
        return toPageResponse(bookingPage);
    }

    @Transactional(readOnly = true)
    public PageResponse<BookingResponse> getPropertyBookings(Long propertyId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Booking> bookingPage = bookingRepository.findByPropertyId(propertyId, pageable);
        return toPageResponse(bookingPage);
    }

    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request) {
        User renter = currentUser.getUser();
        if (renter == null) {
            throw new UnauthorizedException("You must be logged in to create a booking");
        }

        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", request.getPropertyId()));

        if (property.getOwner().getId().equals(renter.getId())) {
            throw new BadRequestException("You cannot book your own property");
        }
        if (!property.getIsAvailable()) {
            throw new BadRequestException("This property is not available for booking");
        }
        if (request.getStartDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Start date cannot be in the past");
        }
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End date must be after start date");
        }
        if (bookingRepository.existsOverlappingBooking(property.getId(), request.getStartDate(), request.getEndDate())) {
            throw new BadRequestException("Property is already booked for the selected dates");
        }

        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        BigDecimal months = BigDecimal.valueOf(days).divide(BigDecimal.valueOf(30), 2, RoundingMode.CEILING);
        BigDecimal totalPrice = property.getPrice().multiply(months);

        Booking booking = Booking.builder()
                .property(property)
                .renter(renter)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .totalPrice(totalPrice)
                .specialRequests(request.getSpecialRequests())
                .status(BookingStatus.PENDING)
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        booking = bookingRepository.save(booking);
        property.setBookingsCount(property.getBookingsCount() + 1);
        propertyRepository.save(property);

        notificationService.notifyUser(
                property.getOwner(),
                NotificationType.BOOKING_CREATED,
                "New booking request",
                "A new booking request was created for " + property.getTitle() + ".",
                renter.getId(),
                NotificationEntityType.BOOKING,
                booking.getId(),
                null
        );

        notificationService.notifyUser(
                renter,
                NotificationType.BOOKING_STATUS_CHANGED,
                "Booking submitted",
                "Your booking request is now PENDING for " + property.getTitle() + ".",
                renter.getId(),
                NotificationEntityType.BOOKING,
                booking.getId(),
                "status=PENDING"
        );

        return bookingMapper.toResponse(booking);
    }

    @Transactional
    public BookingResponse updateBooking(Long id, UpdateBookingRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        User user = currentUser.getUser();
        if (user.getRole() != Role.ADMIN && !booking.getProperty().getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedException("Only the property owner or admin can update this booking");
        }

        if (request.getStartDate() != null) booking.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) booking.setEndDate(request.getEndDate());
        if (request.getSpecialRequests() != null) booking.setSpecialRequests(request.getSpecialRequests());
        BookingStatus previousStatus = booking.getStatus();
        if (request.getStatus() != null) {
            booking.setStatus(BookingStatus.valueOf(request.getStatus().toUpperCase()));
        }
        if (request.getCancellationReason() != null) booking.setCancellationReason(request.getCancellationReason());

        if (request.getStartDate() != null || request.getEndDate() != null) {
            long days = ChronoUnit.DAYS.between(booking.getStartDate(), booking.getEndDate());
            BigDecimal months = BigDecimal.valueOf(days).divide(BigDecimal.valueOf(30), 2, RoundingMode.CEILING);
            booking.setTotalPrice(booking.getProperty().getPrice().multiply(months));
        }

        booking = bookingRepository.save(booking);
        if (request.getStatus() != null && previousStatus != booking.getStatus()) {
            notifyBookingStatusChange(booking, user, request.getCancellationReason());
        }
        return bookingMapper.toResponse(booking);
    }

    @Transactional
    public BookingResponse updateBookingStatus(Long id, BookingStatus status, String cancellationReason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        User user = currentUser.getUser();
        if (user.getRole() != Role.ADMIN && !booking.getProperty().getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedException("Only the property owner or admin can update booking status");
        }

        booking.setStatus(status);
        if (status == BookingStatus.CANCELLED && cancellationReason != null) {
            booking.setCancellationReason(cancellationReason);
        }

        booking = bookingRepository.save(booking);
        notifyBookingStatusChange(booking, user, cancellationReason);
        return bookingMapper.toResponse(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsAwaitingReview(Long renterId) {
        return bookingRepository.findBookingsAwaitingReview(renterId)
                .stream()
                .map(bookingMapper::toResponse)
                .toList();
    }

    private PageResponse<BookingResponse> toPageResponse(Page<Booking> page) {
        return PageResponse.<BookingResponse>builder()
                .content(page.getContent().stream().map(bookingMapper::toResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }

    public Long getCurrentUserId() {
        User user = currentUser.getUser();
        if (user == null) throw new UnauthorizedException("User not authenticated");
        return user.getId();
    }

    private void notifyBookingStatusChange(Booking booking, User actor, String cancellationReason) {
        NotificationType notificationType = booking.getStatus() == BookingStatus.CANCELLED
                ? NotificationType.BOOKING_CANCELLED
                : NotificationType.BOOKING_STATUS_CHANGED;

        String renterMessage = "Your booking status is now " + booking.getStatus().name() + ".";
        if (booking.getStatus() == BookingStatus.CANCELLED && cancellationReason != null && !cancellationReason.isBlank()) {
            renterMessage += " Reason: " + cancellationReason;
        }

        notificationService.notifyUser(
                booking.getRenter(),
                notificationType,
                "Booking status updated",
                renterMessage,
                actor != null ? actor.getId() : null,
                NotificationEntityType.BOOKING,
                booking.getId(),
                "status=" + booking.getStatus().name()
        );

        notificationService.notifyUser(
                booking.getProperty().getOwner(),
                notificationType,
                "Booking status changed",
                "Booking #" + booking.getId() + " for " + booking.getProperty().getTitle() + " is now " + booking.getStatus().name() + ".",
                actor != null ? actor.getId() : null,
                NotificationEntityType.BOOKING,
                booking.getId(),
                "status=" + booking.getStatus().name()
        );
    }
}

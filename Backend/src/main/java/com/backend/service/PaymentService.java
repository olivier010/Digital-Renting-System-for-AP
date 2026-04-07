package com.backend.service;

import com.backend.dto.request.CreatePaymentRequest;
import com.backend.dto.response.PageResponse;
import com.backend.dto.response.PaymentResponse;
import com.backend.dto.response.PropertyEarningsResponse;
import com.backend.entity.Booking;
import com.backend.entity.Payment;
import com.backend.entity.Property;
import com.backend.entity.User;
import com.backend.enums.BookingStatus;
import com.backend.enums.NotificationEntityType;
import com.backend.enums.NotificationType;
import com.backend.enums.PaymentStatus;
import com.backend.enums.PaymentType;
import com.backend.enums.Role;
import com.backend.exception.BadRequestException;
import com.backend.exception.ResourceNotFoundException;
import com.backend.exception.UnauthorizedException;
import com.backend.mapper.PaymentMapper;
import com.backend.repository.BookingRepository;
import com.backend.repository.PaymentRepository;
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
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final PaymentMapper paymentMapper;
    private final CurrentUser currentUser;
    private final PropertyRepository propertyRepository;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public PageResponse<PaymentResponse> getCurrentUserPayments(PaymentStatus status, PaymentType type, int page, int size) {
        User user = currentUser.getUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Payment> paymentPage = paymentRepository.findByRenterIdAndFilters(user.getId(), status, type, pageable);
        return toPageResponse(paymentPage);
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));
        User user = currentUser.getUser();
        if (!payment.getRenter().getId().equals(user.getId()) && !user.getRole().name().equals("ADMIN")) {
            throw new UnauthorizedException("You don't have access to this payment");
        }
        return paymentMapper.toResponse(payment);
    }

    @Transactional
    public PaymentResponse createPayment(CreatePaymentRequest request) {
        User renter = currentUser.getUser();
        if (renter == null) {
            throw new UnauthorizedException("You must be logged in to make a payment");
        }
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", request.getBookingId()));
        if (!booking.getRenter().getId().equals(renter.getId())) {
            throw new UnauthorizedException("You can only pay for your own bookings");
        }
        PaymentType type;
        try {
            type = PaymentType.valueOf(request.getType().toUpperCase());
        } catch (IllegalArgumentException e) {
            notifyPaymentFailure(booking, renter, "Invalid payment type: " + request.getType());
            throw new BadRequestException("Invalid payment type");
        }
        Payment payment;
        try {
            payment = Payment.builder()
                    .booking(booking)
                    .renter(renter)
                    .type(type)
                    .amount(request.getAmount())
                    .method(request.getMethod())
                    .cardLastFour(request.getCardLastFour())
                    .invoiceId("INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                    .status(PaymentStatus.COMPLETED)
                    .build();
            payment = paymentRepository.save(payment);
            booking.setPaymentStatus(PaymentStatus.COMPLETED);
            booking.setStatus(BookingStatus.CONFIRMED);
            bookingRepository.save(booking);
        } catch (RuntimeException ex) {
            notifyPaymentFailure(booking, renter, ex.getMessage());
            throw ex;
        }

        User owner = booking.getProperty().getOwner();
        notificationService.notifyUser(
                renter,
                NotificationType.PAYMENT_SUCCEEDED,
                "Payment successful",
                "Your payment for booking #" + booking.getId() + " was completed successfully.",
                renter.getId(),
                NotificationEntityType.PAYMENT,
                payment.getId(),
                "status=COMPLETED"
        );
        notificationService.notifyUser(
                owner,
                NotificationType.PAYMENT_SUCCEEDED,
                "Payment received",
                "A payment was completed for booking #" + booking.getId() + " on " + booking.getProperty().getTitle() + ".",
                renter.getId(),
                NotificationEntityType.PAYMENT,
                payment.getId(),
                "status=COMPLETED"
        );
        notificationService.notifyRole(
                Role.ADMIN,
                NotificationType.ADMIN_PAYMENT_MONITORING,
                "Payment monitoring event",
                "Payment #" + payment.getId() + " completed for booking #" + booking.getId() + ".",
                renter.getId(),
                NotificationEntityType.PAYMENT,
                payment.getId(),
                "status=COMPLETED"
        );

        return paymentMapper.toResponse(payment);
    }

    @Transactional
    public PaymentResponse refundPayment(Long id, String reason, BigDecimal refundAmount) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));
        if (payment.getStatus() != PaymentStatus.COMPLETED) {
            throw new BadRequestException("Only completed payments can be refunded");
        }
        payment.setStatus(PaymentStatus.REFUNDED);
        payment.setRefundDate(LocalDateTime.now());
        payment.setRefundReason(reason);
        payment.setRefundAmount(refundAmount != null ? refundAmount : payment.getAmount());
        payment = paymentRepository.save(payment);
        Booking booking = payment.getBooking();
        booking.setPaymentStatus(PaymentStatus.REFUNDED);
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        Long actorUserId = currentUser.getUserId();
        User owner = booking.getProperty().getOwner();
        notificationService.notifyUser(
                payment.getRenter(),
                NotificationType.PAYMENT_REFUNDED,
                "Payment refunded",
                "Your payment for booking #" + booking.getId() + " has been refunded.",
                actorUserId,
                NotificationEntityType.PAYMENT,
                payment.getId(),
                "status=REFUNDED"
        );
        notificationService.notifyUser(
                owner,
                NotificationType.PAYMENT_REFUNDED,
                "Payment refunded",
                "Payment for booking #" + booking.getId() + " was refunded.",
                actorUserId,
                NotificationEntityType.PAYMENT,
                payment.getId(),
                "status=REFUNDED"
        );
        notificationService.notifyRole(
                Role.ADMIN,
                NotificationType.ADMIN_PAYMENT_MONITORING,
                "Payment monitoring event",
                "Payment #" + payment.getId() + " was refunded.",
                actorUserId,
                NotificationEntityType.PAYMENT,
                payment.getId(),
                "status=REFUNDED"
        );

        return paymentMapper.toResponse(payment);
    }

    @Transactional(readOnly = true)
    public PageResponse<PaymentResponse> getOwnerPayments(Long ownerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Payment> paymentPage = paymentRepository.findByOwnerId(ownerId, pageable);
        return toPageResponse(paymentPage);
    }

    @Transactional(readOnly = true)
    public List<PropertyEarningsResponse> getOwnerPropertyEarnings(Long ownerId) {
        List<Property> properties = propertyRepository.findByOwnerId(ownerId, Pageable.unpaged()).getContent();
        return properties.stream().map(property -> {
            BigDecimal totalRevenue = paymentRepository
                .findByOwnerId(ownerId, Pageable.unpaged())
                .getContent().stream()
                .filter(p -> p.getBooking().getProperty().getId().equals(property.getId()))
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            int bookingsCount = property.getBookings().size();
            double occupancyRate = 0.0; // Calculate if you have data
            BigDecimal averagePrice = property.getPrice();
            double growth = 0.0; // Calculate if you have data
            return PropertyEarningsResponse.builder()
                    .propertyId(property.getId())
                    .propertyTitle(property.getTitle())
                    .totalRevenue(totalRevenue)
                    .bookingsCount(bookingsCount)
                    .occupancyRate(occupancyRate)
                    .averagePrice(averagePrice)
                    .growth(growth)
                    .build();
        }).collect(Collectors.toList());
    }

    private PageResponse<PaymentResponse> toPageResponse(Page<Payment> page) {
        return PageResponse.<PaymentResponse>builder()
                .content(page.getContent().stream().map(paymentMapper::toResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }

    private void notifyPaymentFailure(Booking booking, User renter, String reason) {
        User owner = booking.getProperty().getOwner();
        String details = reason != null && !reason.isBlank() ? reason : "Payment processing failed";

        notificationService.notifyUser(
                renter,
                NotificationType.PAYMENT_FAILED,
                "Payment failed",
                "Your payment for booking #" + booking.getId() + " failed. Reason: " + details,
                renter.getId(),
                NotificationEntityType.PAYMENT,
                null,
                "status=FAILED"
        );

        notificationService.notifyUser(
                owner,
                NotificationType.PAYMENT_FAILED,
                "Payment failed",
                "A payment attempt failed for booking #" + booking.getId() + " on " + booking.getProperty().getTitle() + ".",
                renter.getId(),
                NotificationEntityType.PAYMENT,
                null,
                "status=FAILED"
        );

        notificationService.notifyRole(
                Role.ADMIN,
                NotificationType.ADMIN_PAYMENT_MONITORING,
                "Payment monitoring event",
                "Payment failed for booking #" + booking.getId() + ". Reason: " + details,
                renter.getId(),
                NotificationEntityType.PAYMENT,
                null,
                "status=FAILED"
        );
    }
}

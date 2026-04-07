package com.backend.service;

import com.backend.dto.request.CreateReviewRequest;
import com.backend.dto.response.PageResponse;
import com.backend.dto.response.ReviewResponse;
import com.backend.entity.Booking;
import com.backend.entity.Property;
import com.backend.entity.Review;
import com.backend.entity.User;
import com.backend.enums.BookingStatus;
import com.backend.enums.NotificationEntityType;
import com.backend.enums.NotificationType;
import com.backend.exception.BadRequestException;
import com.backend.exception.DuplicateResourceException;
import com.backend.exception.ResourceNotFoundException;
import com.backend.exception.UnauthorizedException;
import com.backend.mapper.ReviewMapper;
import com.backend.repository.BookingRepository;
import com.backend.repository.PropertyRepository;
import com.backend.repository.ReviewRepository;
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
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final PropertyRepository propertyRepository;
    private final ReviewMapper reviewMapper;
    private final CurrentUser currentUser;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public PageResponse<ReviewResponse> getPropertyReviews(Long propertyId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Review> reviewPage = reviewRepository.findByPropertyId(propertyId, pageable);

        return toPageResponse(reviewPage);
    }

    @Transactional(readOnly = true)
    public PageResponse<ReviewResponse> getReviewerReviews(Long reviewerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Review> reviewPage = reviewRepository.findByReviewerId(reviewerId, pageable);

        return toPageResponse(reviewPage);
    }

    @Transactional(readOnly = true)
    public PageResponse<ReviewResponse> getOwnerReviews(Long ownerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Review> reviewPage = reviewRepository.findByPropertyOwnerId(ownerId, pageable);

        return toPageResponse(reviewPage);
    }

    @Transactional
    public ReviewResponse createReview(CreateReviewRequest request) {
        User reviewer = currentUser.getUser();
        if (reviewer == null) {
            throw new UnauthorizedException("You must be logged in to create a review");
        }

        // Verify booking exists and belongs to the reviewer
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", request.getBookingId()));

        if (!booking.getRenter().getId().equals(reviewer.getId())) {
            throw new UnauthorizedException("You can only review your own bookings");
        }

        // Verify booking is completed
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BadRequestException("You can only review completed bookings");
        }

        // Verify property matches
        if (!booking.getProperty().getId().equals(request.getPropertyId())) {
            throw new BadRequestException("Property ID does not match booking");
        }

        // Check if review already exists
        if (reviewRepository.existsByBookingId(request.getBookingId())) {
            throw new DuplicateResourceException("You have already reviewed this booking");
        }

        Property property = booking.getProperty();

        Review review = Review.builder()
                .property(property)
                .booking(booking)
                .reviewer(reviewer)
                .overallRating(request.getOverallRating())
                .cleanliness(request.getCleanliness())
                .communication(request.getCommunication())
                .checkIn(request.getCheckIn())
                .accuracy(request.getAccuracy())
                .locationRating(request.getLocationRating())
                .value(request.getValue())
                .comment(request.getComment())
                .wouldRecommend(request.getWouldRecommend())
                .isVerified(true)
                .build();

        review = reviewRepository.save(review);

        // Mark booking as reviewed
        booking.setReviewed(true);
        bookingRepository.save(booking);

        // Update property rating
        updatePropertyRating(property.getId());

        notificationService.notifyUser(
                property.getOwner(),
                NotificationType.REVIEW_RECEIVED,
                "New review received",
                "Your property " + property.getTitle() + " received a new " + request.getOverallRating() + "-star review.",
                reviewer.getId(),
                NotificationEntityType.REVIEW,
                review.getId(),
                null
        );

        return reviewMapper.toResponse(review);
    }

    @Transactional
    public ReviewResponse updateReview(Long id, String comment, Integer overallRating) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", id));

        User user = currentUser.getUser();
        if (!review.getReviewer().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only edit your own reviews");
        }

        if (comment != null) {
            review.setComment(comment);
        }
        if (overallRating != null) {
            review.setOverallRating(overallRating);
        }

        review = reviewRepository.save(review);

        // Update property rating
        updatePropertyRating(review.getProperty().getId());

        return reviewMapper.toResponse(review);
    }

    @Transactional
    public ReviewResponse addHostResponse(Long id, String response) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", id));

        User user = currentUser.getUser();
        if (!review.getProperty().getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedException("Only the property owner can respond to this review");
        }

        review.setHostResponse(response);
        review.setHostResponseDate(LocalDateTime.now());

        review = reviewRepository.save(review);
        return reviewMapper.toResponse(review);
    }

    @Transactional
    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", id));
        User user = currentUser.getUser();
        boolean isRenter = review.getReviewer().getId().equals(user.getId());
        boolean isAdmin = user.getRole().name().equals("ADMIN");
        if (!isRenter && !isAdmin) {
            throw new UnauthorizedException("You can only delete your own reviews or be an admin");
        }
        Booking booking = review.getBooking();
        if (booking != null) {
            booking.setReviewed(false);
            bookingRepository.save(booking);
        }
        reviewRepository.delete(review);
    }

    public Long getCurrentUserId() {
        return currentUser.getUserId();
    }

    private void updatePropertyRating(Long propertyId) {
        Double averageRating = reviewRepository.calculateAverageRating(propertyId);
        long reviewCount = reviewRepository.countByPropertyId(propertyId);

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));

        property.setRating(averageRating != null ? BigDecimal.valueOf(averageRating).setScale(1, RoundingMode.HALF_UP) : BigDecimal.ZERO);
        property.setReviewsCount((int) reviewCount);

        propertyRepository.save(property);
    }

    private PageResponse<ReviewResponse> toPageResponse(Page<Review> page) {
        return PageResponse.<ReviewResponse>builder()
                .content(page.getContent().stream().map(reviewMapper::toResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }
}


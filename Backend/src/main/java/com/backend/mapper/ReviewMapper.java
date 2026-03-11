package com.backend.mapper;

import com.backend.dto.response.ReviewResponse;
import com.backend.entity.Review;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapper {

    public ReviewResponse toResponse(Review review) {
        if (review == null) return null;

        return ReviewResponse.builder()
                .id(review.getId())
                .propertyId(review.getProperty().getId())
                .propertyTitle(review.getProperty().getTitle())
                .bookingId(review.getBooking().getId())
                .reviewer(toReviewerInfo(review))
                .overallRating(review.getOverallRating())
                .cleanliness(review.getCleanliness())
                .communication(review.getCommunication())
                .checkIn(review.getCheckIn())
                .accuracy(review.getAccuracy())
                .locationRating(review.getLocationRating())
                .value(review.getValue())
                .comment(review.getComment())
                .wouldRecommend(review.getWouldRecommend())
                .hostResponse(review.getHostResponse())
                .hostResponseDate(review.getHostResponseDate())
                .isVerified(review.getIsVerified())
                .helpfulCount(review.getHelpfulCount())
                .createdAt(review.getCreatedAt())
                .build();
    }

    private ReviewResponse.ReviewerInfo toReviewerInfo(Review review) {
        if (review.getReviewer() == null) return null;

        return ReviewResponse.ReviewerInfo.builder()
                .id(review.getReviewer().getId())
                .name(review.getReviewer().getFullName())
                .build();
    }
}

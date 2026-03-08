package com.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private Long propertyId;
    private String propertyTitle;
    private Long bookingId;
    private ReviewerInfo reviewer;
    private Integer overallRating;
    private Integer cleanliness;
    private Integer communication;
    private Integer checkIn;
    private Integer accuracy;
    private Integer locationRating;
    private Integer value;
    private String comment;
    private Boolean wouldRecommend;
    private String hostResponse;
    private LocalDateTime hostResponseDate;
    private Boolean isVerified;
    private Integer helpfulCount;
    private LocalDateTime createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReviewerInfo {
        private Long id;
        private String name;
        private String avatar;
    }
}


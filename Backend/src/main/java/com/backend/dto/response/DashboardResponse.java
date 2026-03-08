package com.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    // Admin dashboard stats
    private Long totalUsers;
    private Long totalRenters;
    private Long totalOwners;
    private Long totalProperties;
    private Long activeProperties;
    private Long pendingProperties;
    private Long totalBookings;
    private Long pendingBookings;
    private Long confirmedBookings;
    private Long completedBookings;
    private BigDecimal totalRevenue;

    // Owner dashboard stats
    private Long myProperties;
    private Long myActiveProperties;
    private Long myBookings;
    private Long myPendingBookings;
    private BigDecimal myEarnings;
    private Double averageRating;
    private Long totalReviews;

    // Renter dashboard stats
    private Long myTotalBookings;
    private Long myActiveBookings;
    private Long myFavorites;
    private Long myReviews;
    private BigDecimal totalSpent;
}


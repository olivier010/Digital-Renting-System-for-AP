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
    private Long totalUsersLastMonth;
    private Long totalRenters;
    private Long totalOwners;
    private Long totalProperties;
    private Long totalPropertiesLastMonth;
    private Long activeProperties;
    private Long pendingProperties;
    private Long totalBookings;
    private Long totalBookingsLastMonth;
    private Long pendingBookings;
    private Long confirmedBookings;
    private Long completedBookings;
    private BigDecimal totalRevenue;
    private BigDecimal totalRevenueLastMonth;
    private Long activeUsers; // Only approved users (isActive=true)
    private Double averageRating;
    private Double averageRatingLastMonth;
    private Double uptimePercentage; // Admin system status

    // Owner dashboard stats
    private Long myProperties;
    private Long myActiveProperties;
    private Long myBookings;
    private Long myPendingBookings;
    private BigDecimal myEarnings;
    private Double averageOwnerRating;
    private Long totalOwnerReviews;

    // Owner dashboard monthly stats
    private Long myPropertiesThisMonth;
    private Long myPropertiesLastMonth;
    private Long myBookingsThisMonth;
    private Long myBookingsLastMonth;
    private BigDecimal myEarningsThisMonth;
    private BigDecimal myEarningsLastMonth;
    private Double averageOwnerRatingThisMonth;
    private Double averageOwnerRatingLastMonth;

    // Renter dashboard stats
    private Long myTotalBookings;
    private Long myActiveBookings;
    private Long myFavorites;
    private Long myReviews;
    private BigDecimal totalSpent;
}

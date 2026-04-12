package com.backend.service;

import com.backend.dto.response.DashboardResponse;
import com.backend.entity.User;
import com.backend.enums.BookingStatus;
import com.backend.enums.PropertyStatus;
import com.backend.enums.Role;
import com.backend.repository.*;
import com.backend.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;
    private final FavoriteRepository favoriteRepository;
    private final PaymentRepository paymentRepository;
    private final CurrentUser currentUser;
    private final SystemStatusService systemStatusService;

    @Transactional(readOnly = true)
    public DashboardResponse getAdminDashboard() {
        // Calculate date ranges for current and previous month
        LocalDateTime now = LocalDateTime.now();
        YearMonth thisMonth = YearMonth.from(now);
        YearMonth lastMonth = thisMonth.minusMonths(1);
        LocalDateTime startOfThisMonth = thisMonth.atDay(1).atStartOfDay();
        LocalDateTime startOfLastMonth = lastMonth.atDay(1).atStartOfDay();

        // Users
        long usersLastMonth = userRepository.countRegisteredBetween(startOfLastMonth, startOfThisMonth);
        // Properties
        long propertiesLastMonth = propertyRepository.countCreatedBetween(startOfLastMonth, startOfThisMonth);
        // Bookings
        long bookingsLastMonth = bookingRepository.countCreatedBetween(startOfLastMonth, startOfThisMonth);
        // Revenue
        BigDecimal revenueLastMonth = bookingRepository.calculateRevenueBetween(startOfLastMonth, startOfThisMonth);
        // Ratings
        Double avgRatingThisMonth = reviewRepository.averageRatingBetween(startOfThisMonth, now);
        Double avgRatingLastMonth = reviewRepository.averageRatingBetween(startOfLastMonth, startOfThisMonth);

        double uptimePercentage = systemStatusService.getSystemStatus().getUptimePercentage();
        return DashboardResponse.builder()
            .totalUsers(userRepository.count())
            .totalUsersLastMonth(usersLastMonth)
            .totalRenters(userRepository.countByRole(Role.RENTER))
            .totalOwners(userRepository.countByRole(Role.OWNER))
            .totalProperties(propertyRepository.count())
            .totalPropertiesLastMonth(propertiesLastMonth)
            .activeProperties(propertyRepository.countByStatus(PropertyStatus.ACTIVE))
            .pendingProperties(propertyRepository.countByStatus(PropertyStatus.PENDING))
            .totalBookings(bookingRepository.count())
            .totalBookingsLastMonth(bookingsLastMonth)
            .pendingBookings(bookingRepository.countByStatus(BookingStatus.PENDING))
            .confirmedBookings(bookingRepository.countByStatus(BookingStatus.CONFIRMED))
            .completedBookings(bookingRepository.countByStatus(BookingStatus.COMPLETED))
            .totalRevenue(bookingRepository.calculateTotalRevenue() != null ? bookingRepository.calculateTotalRevenue() : BigDecimal.ZERO)
            .totalRevenueLastMonth(revenueLastMonth != null ? revenueLastMonth : BigDecimal.ZERO)
            .activeUsers(userRepository.countByIsActive(true))
            .averageRating(avgRatingThisMonth != null ? avgRatingThisMonth : 0.0)
            .averageRatingLastMonth(avgRatingLastMonth != null ? avgRatingLastMonth : 0.0)
            .uptimePercentage(uptimePercentage)
            .build();
    }

    @Transactional(readOnly = true)
    public DashboardResponse getOwnerDashboard() {
        User owner = currentUser.getUser();
        Long ownerId = owner.getId();

        BigDecimal earnings = bookingRepository.calculateOwnerRevenue(ownerId);
        Double avgRating = calculateOwnerAverageRating(ownerId);

        return DashboardResponse.builder()
                .myProperties(propertyRepository.countByOwnerId(ownerId))
                .myActiveProperties(propertyRepository.countByOwnerIdAndStatus(ownerId, PropertyStatus.ACTIVE))
                .myBookings(bookingRepository.countByPropertyOwnerId(ownerId))
                .myPendingBookings(bookingRepository.findByPropertyOwnerId(ownerId,
                        PageRequest.of(0, Integer.MAX_VALUE))
                        .getContent().stream()
                        .filter(b -> b.getStatus() == BookingStatus.PENDING)
                        .count())
                .myEarnings(earnings != null ? earnings : BigDecimal.ZERO)
                .averageOwnerRating(avgRating)
                .totalOwnerReviews(countOwnerReviews(ownerId))
                .build();
    }

    @Transactional(readOnly = true)
    public DashboardResponse getRenterDashboard() {
        User renter = currentUser.getUser();
        Long renterId = renter.getId();

        BigDecimal totalSpent = paymentRepository.calculateTotalPaymentsByRenter(renterId);

        return DashboardResponse.builder()
                .myTotalBookings(bookingRepository.countByRenterId(renterId))
                .myActiveBookings(bookingRepository.findByRenterId(renterId,
                        PageRequest.of(0, Integer.MAX_VALUE))
                        .getContent().stream()
                        .filter(b -> b.getStatus() == BookingStatus.CONFIRMED || b.getStatus() == BookingStatus.PENDING)
                        .count())
                .myFavorites(favoriteRepository.countByRenterId(renterId))
                .myReviews(reviewRepository.countByReviewerId(renterId))
                .totalSpent(totalSpent != null ? totalSpent : BigDecimal.ZERO)
                .build();
    }

    @Transactional(readOnly = true)
    public DashboardResponse getOwnerDashboardMonthlyStats() {
        User owner = currentUser.getUser();
        Long ownerId = owner.getId();

        LocalDateTime now = LocalDateTime.now();
        YearMonth thisMonth = YearMonth.from(now);
        YearMonth lastMonth = thisMonth.minusMonths(1);
        LocalDateTime startOfThisMonth = thisMonth.atDay(1).atStartOfDay();
        LocalDateTime startOfLastMonth = lastMonth.atDay(1).atStartOfDay();

        // Properties
        long propertiesThisMonth = propertyRepository.countByOwnerIdAndCreatedAtBetween(ownerId, startOfThisMonth, now);
        long propertiesLastMonth = propertyRepository.countByOwnerIdAndCreatedAtBetween(ownerId, startOfLastMonth, startOfThisMonth);
        // Bookings
        long bookingsThisMonth = bookingRepository.countByOwnerIdAndCreatedAtBetween(ownerId, startOfThisMonth, now);
        long bookingsLastMonth = bookingRepository.countByOwnerIdAndCreatedAtBetween(ownerId, startOfLastMonth, startOfThisMonth);
        // Earnings based on completed payment dates
        BigDecimal earningsThisMonth = paymentRepository.sumOwnerCompletedPaymentsBetween(ownerId, startOfThisMonth, now);
        BigDecimal earningsLastMonth = paymentRepository.sumOwnerCompletedPaymentsBetween(ownerId, startOfLastMonth, startOfThisMonth);
        // Ratings
        Double avgRatingThisMonth = reviewRepository.averageRatingByOwnerAndCreatedAtBetween(ownerId, startOfThisMonth, now);
        Double avgRatingLastMonth = reviewRepository.averageRatingByOwnerAndCreatedAtBetween(ownerId, startOfLastMonth, startOfThisMonth);

        return DashboardResponse.builder()
                .myPropertiesThisMonth(propertiesThisMonth)
                .myPropertiesLastMonth(propertiesLastMonth)
                .myBookingsThisMonth(bookingsThisMonth)
                .myBookingsLastMonth(bookingsLastMonth)
                .myEarningsThisMonth(earningsThisMonth != null ? earningsThisMonth : BigDecimal.ZERO)
                .myEarningsLastMonth(earningsLastMonth != null ? earningsLastMonth : BigDecimal.ZERO)
                .averageOwnerRatingThisMonth(avgRatingThisMonth != null ? avgRatingThisMonth : 0.0)
                .averageOwnerRatingLastMonth(avgRatingLastMonth != null ? avgRatingLastMonth : 0.0)
                .build();
    }

    @Transactional(readOnly = true)
    public List<java.util.Map<String, Object>> getMonthlyRevenue() {
        List<Object[]> results = bookingRepository.findMonthlyRevenue();
        List<java.util.Map<String, Object>> monthlyRevenue = new java.util.ArrayList<>();
        for (Object[] row : results) {
            int year = ((Number) row[0]).intValue();
            int month = ((Number) row[1]).intValue();
            java.math.BigDecimal revenue = (java.math.BigDecimal) row[2];
            String monthStr = String.format("%04d-%02d", year, month);
            java.util.Map<String, Object> entry = new java.util.HashMap<>();
            entry.put("month", monthStr);
            entry.put("revenue", revenue);
            monthlyRevenue.add(entry);
        }
        return monthlyRevenue;
    }

    private Double calculateOwnerAverageRating(Long ownerId) {
        var properties = propertyRepository.findByOwnerId(ownerId, PageRequest.of(0, Integer.MAX_VALUE));
        if (properties.isEmpty()) return 0.0;

        double totalRating = 0;
        int count = 0;
        for (var property : properties) {
            if (property.getReviewsCount() > 0) {
                totalRating += property.getRating().doubleValue();
                count++;
            }
        }
        return count > 0 ? totalRating / count : 0.0;
    }

    private Long countOwnerReviews(Long ownerId) {
        return reviewRepository.findByPropertyOwnerId(ownerId, PageRequest.of(0, 1)).getTotalElements();
    }
}

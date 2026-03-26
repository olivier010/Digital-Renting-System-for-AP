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

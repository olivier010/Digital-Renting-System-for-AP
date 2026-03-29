package com.backend.controller;

import com.backend.dto.response.ApiResponse;
import com.backend.dto.response.DashboardResponse;
import com.backend.dto.response.PageResponse;
import com.backend.dto.response.PaymentResponse;
import com.backend.dto.response.PropertyResponse;
import com.backend.dto.response.BookingResponse;
import com.backend.dto.response.ReviewResponse;
import com.backend.enums.BookingStatus;
import com.backend.security.CurrentUser;
import com.backend.service.BookingService;
import com.backend.service.DashboardService;
import com.backend.service.PaymentService;
import com.backend.service.PropertyService;
import com.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/owner")
@RequiredArgsConstructor
@PreAuthorize("hasRole('OWNER')")
public class OwnerController {

    private final DashboardService dashboardService;
    private final PaymentService paymentService;
    private final PropertyService propertyService;
    private final BookingService bookingService;
    private final ReviewService reviewService;
    private final CurrentUser currentUser;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {
        DashboardResponse response = dashboardService.getOwnerDashboard();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/earnings")
    public ResponseEntity<ApiResponse<DashboardResponse>> getEarnings() {
        DashboardResponse response = dashboardService.getOwnerDashboard();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/earnings/transactions")
    public ResponseEntity<ApiResponse<PageResponse<PaymentResponse>>> getTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Long ownerId = currentUser.getUserId();
        PageResponse<PaymentResponse> response = paymentService.getOwnerPayments(ownerId, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/properties")
    public ResponseEntity<ApiResponse<PageResponse<PropertyResponse>>> getOwnerProperties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Long ownerId = currentUser.getUserId();
        PageResponse<PropertyResponse> response = propertyService.getOwnerProperties(ownerId, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<PageResponse<BookingResponse>>> getOwnerBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        // Parse status and dates if provided
        BookingStatus bookingStatus = null;
        if (status != null) {
            try {
                bookingStatus = BookingStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }
        LocalDate start = startDate != null ? LocalDate.parse(startDate) : null;
        LocalDate end = endDate != null ? LocalDate.parse(endDate) : null;
        PageResponse<BookingResponse> response = bookingService.getAllBookings(bookingStatus, start, end, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/reviews")
    public ResponseEntity<ApiResponse<PageResponse<ReviewResponse>>> getOwnerReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Long ownerId = currentUser.getUserId();
        PageResponse<ReviewResponse> response = reviewService.getOwnerReviews(ownerId, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/earnings/properties")
    public ResponseEntity<ApiResponse<?>> getPropertyEarnings() {
        Long ownerId = currentUser.getUserId();
        // You may want to create a DTO for per-property earnings, e.g., PropertyEarningsResponse
        var propertyEarnings = paymentService.getOwnerPropertyEarnings(ownerId);
        return ResponseEntity.ok(ApiResponse.success(propertyEarnings));
    }

    @GetMapping("/dashboard/monthly-stats")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboardMonthlyStats() {
        DashboardResponse response = dashboardService.getOwnerDashboardMonthlyStats();
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

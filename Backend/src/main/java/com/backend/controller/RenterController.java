package com.backend.controller;

import com.backend.dto.request.CancelBookingRequest;
import com.backend.dto.response.ApiResponse;
import com.backend.dto.response.BookingResponse;
import com.backend.dto.response.DashboardResponse;
import com.backend.dto.response.PageResponse;
import com.backend.service.BookingService;
import com.backend.service.DashboardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/renter")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RENTER')")
public class RenterController {

    private final DashboardService dashboardService;
    private final BookingService bookingService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {
        DashboardResponse response = dashboardService.getRenterDashboard();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<PageResponse<BookingResponse>>> getRenterBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(value = "status", required = false) String status) {
        Long renterId = bookingService.getCurrentUserId();
        PageResponse<BookingResponse> response = bookingService.getRenterBookings(renterId, page, size, status);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/bookings/{bookingId}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @PathVariable Long bookingId,
            @Valid @RequestBody(required = false) CancelBookingRequest request) {
        String reason = request != null ? request.getCancellationReason() : null;
        BookingResponse response = bookingService.cancelBookingByRenter(bookingId, reason);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", response));
    }
}

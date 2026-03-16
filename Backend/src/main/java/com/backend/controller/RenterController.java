package com.backend.controller;

import com.backend.dto.response.ApiResponse;
import com.backend.dto.response.BookingResponse;
import com.backend.dto.response.DashboardResponse;
import com.backend.dto.response.PageResponse;
import com.backend.service.BookingService;
import com.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
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
            @RequestParam(defaultValue = "10") int size) {
        // Get current renter's ID from security context
        Long renterId = bookingService.getCurrentUserId();
        PageResponse<BookingResponse> response = bookingService.getRenterBookings(renterId, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

package com.backend.controller;

import com.backend.dto.response.ApiResponse;
import com.backend.dto.response.DashboardResponse;
import com.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final DashboardService dashboardService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {
        DashboardResponse response = dashboardService.getAdminDashboard();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/reports/revenue")
    public ResponseEntity<ApiResponse<Object>> getRevenueReport() {
        return ResponseEntity.ok(ApiResponse.success("Revenue report endpoint", null));
    }

    @GetMapping("/reports/users")
    public ResponseEntity<ApiResponse<Object>> getUsersReport() {
        return ResponseEntity.ok(ApiResponse.success("Users report endpoint", null));
    }

    @GetMapping("/reports/bookings")
    public ResponseEntity<ApiResponse<Object>> getBookingsReport() {
        return ResponseEntity.ok(ApiResponse.success("Bookings report endpoint", null));
    }

    @GetMapping("/logs")
    public ResponseEntity<ApiResponse<Object>> getSystemLogs() {
        return ResponseEntity.ok(ApiResponse.success("System logs endpoint", null));
    }

    @GetMapping("/issues")
    public ResponseEntity<ApiResponse<Object>> getReportedIssues() {
        return ResponseEntity.ok(ApiResponse.success("Reported issues endpoint", null));
    }

    @GetMapping("/settings")
    public ResponseEntity<ApiResponse<Object>> getSettings() {
        return ResponseEntity.ok(ApiResponse.success("Settings endpoint", null));
    }
}

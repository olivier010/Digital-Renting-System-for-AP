package com.backend.controller;

import com.backend.dto.response.ApiResponse;
import com.backend.dto.response.DashboardResponse;
import com.backend.dto.response.SystemStatusResponse;
import com.backend.service.DashboardService;
import com.backend.service.LogService;
import com.backend.service.SystemStatusService;
import com.backend.entity.Log;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final DashboardService dashboardService;
    private final LogService logService;
    private final SystemStatusService systemStatusService;

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
    public ResponseEntity<ApiResponse<List<Log>>> getSystemLogs() {
        List<Log> logs = logService.getAllLogs();
        return ResponseEntity.ok(ApiResponse.success(logs));
    }

    @GetMapping("/issues")
    public ResponseEntity<ApiResponse<Object>> getReportedIssues() {
        return ResponseEntity.ok(ApiResponse.success("Reported issues endpoint", null));
    }

    @GetMapping("/settings")
    public ResponseEntity<ApiResponse<Object>> getSettings() {
        return ResponseEntity.ok(ApiResponse.success("Settings endpoint", null));
    }

    @GetMapping("/system-status")
    public ResponseEntity<ApiResponse<SystemStatusResponse>> getSystemStatus() {
        SystemStatusResponse status = systemStatusService.getSystemStatus();
        return ResponseEntity.ok(ApiResponse.success(status));
    }
}

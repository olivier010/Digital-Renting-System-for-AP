package com.backend.controller;

import com.backend.dto.response.ApiResponse;
import com.backend.dto.response.MarkAllReadResponse;
import com.backend.dto.response.NotificationResponse;
import com.backend.dto.response.PageResponse;
import com.backend.dto.response.UnreadCountResponse;
import com.backend.enums.NotificationType;
import com.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<NotificationResponse>>> getCurrentUserNotifications(
            @RequestParam(required = false) Boolean unread,
            @RequestParam(required = false) NotificationType type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageResponse<NotificationResponse> notifications = notificationService.getCurrentUserNotifications(
                unread, type, from, to, page, size
        );
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<UnreadCountResponse>> getUnreadCount() {
        long unreadCount = notificationService.getUnreadCountForCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(
                UnreadCountResponse.builder().unreadCount(unreadCount).build()
        ));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(@PathVariable Long id) {
        NotificationResponse notification = notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", notification));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<MarkAllReadResponse>> markAllAsRead() {
        int updatedCount = notificationService.markAllAsRead();
        return ResponseEntity.ok(ApiResponse.success(
                "All notifications marked as read",
                MarkAllReadResponse.builder().updatedCount(updatedCount).build()
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok(ApiResponse.success("Notification deleted successfully", null));
    }
}


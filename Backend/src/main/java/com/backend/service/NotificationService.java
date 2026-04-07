package com.backend.service;

import com.backend.dto.response.NotificationResponse;
import com.backend.dto.response.PageResponse;
import com.backend.entity.Notification;
import com.backend.entity.User;
import com.backend.enums.NotificationEntityType;
import com.backend.enums.NotificationType;
import com.backend.enums.Role;
import com.backend.exception.ResourceNotFoundException;
import com.backend.exception.UnauthorizedException;
import com.backend.mapper.NotificationMapper;
import com.backend.repository.NotificationRepository;
import com.backend.repository.UserRepository;
import com.backend.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final CurrentUser currentUser;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public PageResponse<NotificationResponse> getCurrentUserNotifications(Boolean unread,
                                                                          NotificationType type,
                                          LocalDateTime fromDate,
                                          LocalDateTime toDate,
                                                                          int page,
                                                                          int size) {
        User user = requireCurrentUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Notification> notifications = notificationRepository.findByRecipientWithFilters(
            user.getId(), unread, type, fromDate, toDate, pageable
        );
        return toPageResponse(notifications);
    }

    @Transactional(readOnly = true)
    public long getUnreadCountForCurrentUser() {
        User user = requireCurrentUser();
        return notificationRepository.countByRecipientUserIdAndIsReadFalse(user.getId());
    }

    @Transactional
    public NotificationResponse markAsRead(Long notificationId) {
        User user = requireCurrentUser();

        Notification notification = notificationRepository.findByIdAndRecipientUserId(notificationId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));

        if (!Boolean.TRUE.equals(notification.getIsRead())) {
            notification.setIsRead(true);
            notification.setReadAt(LocalDateTime.now());
            notification = notificationRepository.save(notification);
        }

        return notificationMapper.toResponse(notification);
    }

    @Transactional
    public int markAllAsRead() {
        User user = requireCurrentUser();
        return notificationRepository.markAllAsReadForUser(user.getId(), LocalDateTime.now());
    }

    @Transactional
    public void deleteNotification(Long notificationId) {
        User user = requireCurrentUser();
        Notification notification = notificationRepository.findByIdAndRecipientUserId(notificationId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));
        notificationRepository.delete(notification);
    }

    @Transactional
    public void notifyUser(User recipient,
                           NotificationType type,
                           String title,
                           String body,
                           Long actorUserId,
                           NotificationEntityType entityType,
                           Long entityId,
                           String metadata) {
        if (recipient == null) {
            return;
        }

        Notification notification = Notification.builder()
                .recipientUser(recipient)
                .recipientRole(recipient.getRole())
                .type(type)
                .title(title)
                .body(body)
                .actorUserId(actorUserId)
                .entityType(entityType)
                .entityId(entityId)
                .metadata(metadata)
                .build();

        notificationRepository.save(notification);
    }

    @Transactional
    public void notifyUserById(Long recipientUserId,
                               NotificationType type,
                               String title,
                               String body,
                               Long actorUserId,
                               NotificationEntityType entityType,
                               Long entityId,
                               String metadata) {
        userRepository.findById(recipientUserId)
                .ifPresent(user -> notifyUser(user, type, title, body, actorUserId, entityType, entityId, metadata));
    }

    @Transactional
    public void notifyRole(Role role,
                           NotificationType type,
                           String title,
                           String body,
                           Long actorUserId,
                           NotificationEntityType entityType,
                           Long entityId,
                           String metadata) {
        List<User> recipients = userRepository.findAllByRole(role);
        for (User recipient : recipients) {
            notifyUser(recipient, type, title, body, actorUserId, entityType, entityId, metadata);
        }
    }

    private User requireCurrentUser() {
        User user = currentUser.getUser();
        if (user == null) {
            throw new UnauthorizedException("User not authenticated");
        }
        return user;
    }

    private PageResponse<NotificationResponse> toPageResponse(Page<Notification> page) {
        return PageResponse.<NotificationResponse>builder()
                .content(page.getContent().stream().map(notificationMapper::toResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }
}


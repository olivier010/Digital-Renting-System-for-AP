package com.backend.service;

import com.backend.dto.response.NotificationResponse;
import com.backend.dto.response.PageResponse;
import com.backend.entity.Notification;
import com.backend.entity.User;
import com.backend.enums.NotificationType;
import com.backend.enums.Role;
import com.backend.exception.ResourceNotFoundException;
import com.backend.mapper.NotificationMapper;
import com.backend.repository.NotificationRepository;
import com.backend.repository.UserRepository;
import com.backend.security.CurrentUser;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private NotificationMapper notificationMapper;

    @Mock
    private CurrentUser currentUser;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private NotificationService notificationService;

    @Test
    void getCurrentUserNotificationsReturnsPaginatedResponse() {
        User user = User.builder().id(1L).role(Role.RENTER).build();
        Notification notification = Notification.builder().id(11L).title("t").build();
        NotificationResponse mapped = NotificationResponse.builder().id(11L).title("t").build();
        Page<Notification> page = new PageImpl<>(List.of(notification));

        when(currentUser.getUser()).thenReturn(user);
        when(notificationRepository.findByRecipientWithFilters(eq(1L), isNull(), isNull(), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(page);
        when(notificationMapper.toResponse(notification)).thenReturn(mapped);

        PageResponse<NotificationResponse> result = notificationService.getCurrentUserNotifications(null, null, null, null, 0, 10);

        assertEquals(1, result.getContent().size());
        assertEquals(11L, result.getContent().get(0).getId());
        verify(notificationRepository).findByRecipientWithFilters(eq(1L), isNull(), isNull(), isNull(), isNull(), any(Pageable.class));
    }

    @Test
    void markAsReadThrowsWhenNotificationNotOwnedByUser() {
        User user = User.builder().id(5L).role(Role.OWNER).build();
        when(currentUser.getUser()).thenReturn(user);
        when(notificationRepository.findByIdAndRecipientUserId(99L, 5L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> notificationService.markAsRead(99L));
    }

    @Test
    void markAllAsReadReturnsUpdatedCount() {
        User user = User.builder().id(7L).role(Role.ADMIN).build();
        when(currentUser.getUser()).thenReturn(user);
        when(notificationRepository.markAllAsReadForUser(eq(7L), any())).thenReturn(3);

        int updatedCount = notificationService.markAllAsRead();

        assertEquals(3, updatedCount);
        verify(notificationRepository).markAllAsReadForUser(eq(7L), any());
    }

    @Test
    void notifyRoleSendsToEveryUserInRole() {
        User admin1 = User.builder().id(1L).role(Role.ADMIN).build();
        User admin2 = User.builder().id(2L).role(Role.ADMIN).build();
        when(userRepository.findAllByRole(Role.ADMIN)).thenReturn(List.of(admin1, admin2));

        notificationService.notifyRole(Role.ADMIN, NotificationType.SYSTEM_ALERT, "Alert", "Body", null, null, null, null);

        verify(notificationRepository, times(2)).save(any(Notification.class));
    }
}


package com.backend.repository;

import com.backend.entity.Notification;
import com.backend.enums.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

public interface NotificationRepositoryCustom {

    Page<Notification> findByRecipientWithFilters(Long userId,
                                                  Boolean unread,
                                                  NotificationType type,
                                                  LocalDateTime fromDate,
                                                  LocalDateTime toDate,
                                                  Pageable pageable);
}

package com.backend.mapper;

import com.backend.dto.response.NotificationResponse;
import com.backend.entity.Notification;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationResponse toResponse(Notification notification) {
        if (notification == null) {
            return null;
        }

        return NotificationResponse.builder()
                .id(notification.getId())
                .type(notification.getType())
                .title(notification.getTitle())
                .body(notification.getBody())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .readAt(notification.getReadAt())
                .actorUserId(notification.getActorUserId())
                .entityType(notification.getEntityType())
                .entityId(notification.getEntityId())
                .metadata(notification.getMetadata())
                .build();
    }
}

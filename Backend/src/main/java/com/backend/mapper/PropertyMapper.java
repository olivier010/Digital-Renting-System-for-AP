package com.backend.mapper;

import com.backend.dto.response.PropertyResponse;
import com.backend.entity.Property;
import org.springframework.stereotype.Component;

@Component
public class PropertyMapper {

    public PropertyResponse toResponse(Property property) {
        if (property == null) return null;

        return PropertyResponse.builder()
                .id(property.getId())
                .title(property.getTitle())
                .description(property.getDescription())
                .category(property.getCategory().name())
                .location(property.getLocation())
                .price(property.getPrice())
                .isAvailable(property.getIsAvailable())
                .isFeatured(property.getIsFeatured())
                .isVerified(property.getIsVerified())
                .status(property.getStatus().name())
                .images(property.getImages())
                .bookingsCount(property.getBookingsCount())
                .rating(property.getRating())
                .reviewsCount(property.getReviewsCount())
                .viewsCount(property.getViewsCount())
                .savesCount(property.getSavesCount())
                .owner(toOwnerInfo(property))
                .createdAt(property.getCreatedAt())
                .updatedAt(property.getUpdatedAt())
                .build();
    }

    private PropertyResponse.OwnerInfo toOwnerInfo(Property property) {
        if (property.getOwner() == null) return null;

        return PropertyResponse.OwnerInfo.builder()
                .id(property.getOwner().getId())
                .name(property.getOwner().getFullName())
                .email(property.getOwner().getEmail())
                .phone(property.getOwner().getPhone())
                .build();
    }
}

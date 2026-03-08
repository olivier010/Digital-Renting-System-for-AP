package com.backend.mapper;

import com.backend.dto.response.FavoriteResponse;
import com.backend.entity.Favorite;
import org.springframework.stereotype.Component;

@Component
public class FavoriteMapper {

    public FavoriteResponse toResponse(Favorite favorite) {
        if (favorite == null) return null;

        return FavoriteResponse.builder()
                .id(favorite.getId())
                .property(toPropertyInfo(favorite))
                .savedAt(favorite.getSavedAt())
                .build();
    }

    private FavoriteResponse.PropertyInfo toPropertyInfo(Favorite favorite) {
        if (favorite.getProperty() == null) return null;

        return FavoriteResponse.PropertyInfo.builder()
                .id(favorite.getProperty().getId())
                .title(favorite.getProperty().getTitle())
                .location(favorite.getProperty().getLocation())
                .category(favorite.getProperty().getCategory().name())
                .price(favorite.getProperty().getPrice())
                .image(favorite.getProperty().getImages().isEmpty() ? null : favorite.getProperty().getImages().get(0))
                .rating(favorite.getProperty().getRating())
                .reviewsCount(favorite.getProperty().getReviewsCount())
                .isAvailable(favorite.getProperty().getIsAvailable())
                .build();
    }
}


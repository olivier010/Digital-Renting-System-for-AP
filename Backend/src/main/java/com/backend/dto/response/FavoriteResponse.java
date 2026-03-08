package com.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteResponse {
    private Long id;
    private PropertyInfo property;
    private LocalDateTime savedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PropertyInfo {
        private Long id;
        private String title;
        private String location;
        private String category;
        private BigDecimal price;
        private String image;
        private BigDecimal rating;
        private Integer reviewsCount;
        private Boolean isAvailable;
    }
}


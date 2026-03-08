package com.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyResponse {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String location;
    private BigDecimal price;
    private Boolean isAvailable;
    private Boolean isFeatured;
    private Boolean isVerified;
    private String status;
    private List<String> images;
    private String rules;
    private Integer bookingsCount;
    private BigDecimal rating;
    private Integer reviewsCount;
    private Integer viewsCount;
    private Integer savesCount;
    private OwnerInfo owner;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OwnerInfo {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private String avatar;
    }
}


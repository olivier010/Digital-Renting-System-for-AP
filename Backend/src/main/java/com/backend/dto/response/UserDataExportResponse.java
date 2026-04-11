package com.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDataExportResponse {

    private UserResponse user;
    private DataSummary summary;
    private LocalDateTime exportedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DataSummary {
        private Long propertiesCount;
        private Long bookingsCount;
        private Long favoritesCount;
        private Long reviewsCount;
        private Long paymentsCount;
        private Long paymentMethodsCount;
        private Long notificationsCount;
    }
}

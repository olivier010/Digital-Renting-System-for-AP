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
public class PaymentResponse {
    private Long id;
    private Long bookingId;
    private PropertyInfo property;
    private String type;
    private BigDecimal amount;
    private String status;
    private String method;
    private String cardLastFour;
    private String invoiceId;
    private LocalDateTime refundDate;
    private BigDecimal refundAmount;
    private String refundReason;
    private LocalDateTime createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PropertyInfo {
        private Long id;
        private String title;
        private String location;
    }
}


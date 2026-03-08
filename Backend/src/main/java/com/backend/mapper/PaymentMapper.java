package com.backend.mapper;

import com.backend.dto.response.PaymentResponse;
import com.backend.entity.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public PaymentResponse toResponse(Payment payment) {
        if (payment == null) return null;

        return PaymentResponse.builder()
                .id(payment.getId())
                .bookingId(payment.getBooking().getId())
                .property(toPropertyInfo(payment))
                .type(payment.getType().name())
                .amount(payment.getAmount())
                .status(payment.getStatus().name())
                .method(payment.getMethod())
                .cardLastFour(payment.getCardLastFour())
                .invoiceId(payment.getInvoiceId())
                .refundDate(payment.getRefundDate())
                .refundAmount(payment.getRefundAmount())
                .refundReason(payment.getRefundReason())
                .createdAt(payment.getCreatedAt())
                .build();
    }

    private PaymentResponse.PropertyInfo toPropertyInfo(Payment payment) {
        if (payment.getBooking() == null || payment.getBooking().getProperty() == null) return null;

        return PaymentResponse.PropertyInfo.builder()
                .id(payment.getBooking().getProperty().getId())
                .title(payment.getBooking().getProperty().getTitle())
                .location(payment.getBooking().getProperty().getLocation())
                .build();
    }
}


package com.backend.mapper;

import com.backend.dto.response.PaymentMethodResponse;
import com.backend.entity.PaymentMethod;
import org.springframework.stereotype.Component;

@Component
public class PaymentMethodMapper {

    public PaymentMethodResponse toResponse(PaymentMethod paymentMethod) {
        if (paymentMethod == null) return null;

        return PaymentMethodResponse.builder()
                .id(paymentMethod.getId())
                .brand(paymentMethod.getBrand())
                .last4(paymentMethod.getLast4())
                .expiryMonth(paymentMethod.getExpiryMonth())
                .expiryYear(paymentMethod.getExpiryYear())
                .cardHolderName(paymentMethod.getCardHolderName())
                .isDefault(paymentMethod.getIsDefault())
                .isActive(paymentMethod.getIsActive())
                .createdAt(paymentMethod.getCreatedAt())
                .updatedAt(paymentMethod.getUpdatedAt())
                .build();
    }
}

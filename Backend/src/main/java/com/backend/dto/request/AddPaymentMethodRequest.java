package com.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddPaymentMethodRequest {

    @NotBlank(message = "Card brand is required")
    private String brand; // VISA, MASTERCARD, AMEX, etc.

    @NotBlank(message = "Last 4 digits are required")
    @Pattern(regexp = "^\\d{4}$", message = "Last 4 digits must be exactly 4 numbers")
    private String last4;

    @NotBlank(message = "Expiry month is required")
    @Pattern(regexp = "^(0[1-9]|1[0-2])$", message = "Expiry month must be between 01 and 12")
    private String expiryMonth;

    @NotBlank(message = "Expiry year is required")
    @Pattern(regexp = "^\\d{4}$", message = "Expiry year must be 4 digits")
    private String expiryYear;

    @Size(max = 100, message = "Card holder name must not exceed 100 characters")
    private String cardHolderName;

    @Builder.Default
    private Boolean isDefault = false;
}

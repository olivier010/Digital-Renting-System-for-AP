package com.backend.controller;

import com.backend.dto.request.AddPaymentMethodRequest;
import com.backend.dto.request.UpdatePaymentMethodRequest;
import com.backend.dto.response.ApiResponse;
import com.backend.dto.response.PaymentMethodResponse;
import com.backend.service.PaymentMethodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-methods")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class PaymentMethodController {

    private final PaymentMethodService paymentMethodService;

    /**
     * Add a new payment method for the current user
     * POST /api/payment-methods
     */
    @PostMapping
    public ResponseEntity<ApiResponse<PaymentMethodResponse>> addPaymentMethod(
            @Valid @RequestBody AddPaymentMethodRequest request) {
        PaymentMethodResponse response = paymentMethodService.addPaymentMethod(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Payment method added successfully", response));
    }

    /**
     * Get all active payment methods for the current user
     * GET /api/payment-methods
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentMethodResponse>>> getPaymentMethods() {
        List<PaymentMethodResponse> response = paymentMethodService.getUserPaymentMethods();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Get a specific payment method by ID
     * GET /api/payment-methods/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentMethodResponse>> getPaymentMethod(@PathVariable Long id) {
        PaymentMethodResponse response = paymentMethodService.getPaymentMethodById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Update a payment method
     * PUT /api/payment-methods/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentMethodResponse>> updatePaymentMethod(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePaymentMethodRequest request) {
        PaymentMethodResponse response = paymentMethodService.updatePaymentMethod(id, request);
        return ResponseEntity.ok(ApiResponse.success("Payment method updated successfully", response));
    }

    /**
     * Set a payment method as the default
     * PATCH /api/payment-methods/{id}/default
     */
    @PatchMapping("/{id}/default")
    public ResponseEntity<ApiResponse<PaymentMethodResponse>> setDefaultPaymentMethod(@PathVariable Long id) {
        PaymentMethodResponse response = paymentMethodService.setDefaultPaymentMethod(id);
        return ResponseEntity.ok(ApiResponse.success("Payment method set as default", response));
    }

    /**
     * Get the default payment method
     * GET /api/payment-methods/default
     */
    @GetMapping("/default")
    public ResponseEntity<ApiResponse<PaymentMethodResponse>> getDefaultPaymentMethod() {
        PaymentMethodResponse response = paymentMethodService.getDefaultPaymentMethod();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Delete a payment method
     * DELETE /api/payment-methods/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePaymentMethod(@PathVariable Long id) {
        paymentMethodService.deletePaymentMethod(id);
        return ResponseEntity.ok(ApiResponse.success("Payment method deleted successfully", null));
    }
}

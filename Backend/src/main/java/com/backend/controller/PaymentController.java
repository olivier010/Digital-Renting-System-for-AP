package com.backend.controller;

import com.backend.dto.request.CreatePaymentRequest;
import com.backend.dto.request.RefundPaymentRequest;
import com.backend.dto.response.ApiResponse;
import com.backend.dto.response.PageResponse;
import com.backend.dto.response.PaymentResponse;
import com.backend.enums.PaymentStatus;
import com.backend.enums.PaymentType;
import com.backend.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentResponse>> createPayment(@Valid @RequestBody CreatePaymentRequest request) {
        PaymentResponse payment = paymentService.createPayment(request);
        return ResponseEntity.ok(ApiResponse.success(payment));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PaymentResponse>>> getPayments(
            @RequestParam(value = "status", required = false) PaymentStatus status,
            @RequestParam(value = "type", required = false) PaymentType type,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        PageResponse<PaymentResponse> payments = paymentService.getCurrentUserPayments(status, type, page, size);
        return ResponseEntity.ok(ApiResponse.success(payments));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentById(@PathVariable Long id) {
        PaymentResponse payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(ApiResponse.success(payment));
    }

    @PostMapping("/{id}/refund")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PaymentResponse>> refundPayment(
            @PathVariable Long id,
            @Valid @RequestBody RefundPaymentRequest request) {
        PaymentResponse payment = paymentService.refundPayment(id, request.getReason(), request.getRefundAmount());
        return ResponseEntity.ok(ApiResponse.success(payment));
    }
}

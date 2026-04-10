package com.backend.service;

import com.backend.dto.request.AddPaymentMethodRequest;
import com.backend.dto.request.UpdatePaymentMethodRequest;
import com.backend.dto.response.PaymentMethodResponse;
import com.backend.entity.PaymentMethod;
import com.backend.entity.User;
import com.backend.exception.BadRequestException;
import com.backend.exception.ResourceNotFoundException;
import com.backend.mapper.PaymentMethodMapper;
import com.backend.repository.PaymentMethodRepository;
import com.backend.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentMethodService {

    private final PaymentMethodRepository paymentMethodRepository;
    private final PaymentMethodMapper paymentMethodMapper;
    private final CurrentUser currentUser;

    @Transactional
    public PaymentMethodResponse addPaymentMethod(AddPaymentMethodRequest request) {
        User user = currentUser.getUser();
        
        // Check if card already exists for this user
        if (paymentMethodRepository.existsByUserIdAndLast4(user.getId(), request.getLast4())) {
            throw new BadRequestException("A payment method with this card number already exists");
        }

        // If this is the first card, make it default
        boolean isDefault = request.getIsDefault() || 
                           paymentMethodRepository.findByUserIdAndIsActiveTrue(user.getId()).isEmpty();

        // If setting as default, unset any other default cards
        if (isDefault) {
            paymentMethodRepository.findByUserIdAndIsDefaultTrue(user.getId())
                    .ifPresent(pm -> {
                        pm.setIsDefault(false);
                        paymentMethodRepository.save(pm);
                    });
        }

        PaymentMethod paymentMethod = PaymentMethod.builder()
                .user(user)
                .brand(request.getBrand())
                .last4(request.getLast4())
                .expiryMonth(request.getExpiryMonth())
                .expiryYear(request.getExpiryYear())
                .cardHolderName(request.getCardHolderName())
                .isDefault(isDefault)
                .isActive(true)
                .build();

        PaymentMethod saved = paymentMethodRepository.save(paymentMethod);
        return paymentMethodMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<PaymentMethodResponse> getUserPaymentMethods() {
        User user = currentUser.getUser();
        List<PaymentMethod> methods = paymentMethodRepository.findActivePaymentMethodsByUserId(user.getId());
        return methods.stream()
                .map(paymentMethodMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PaymentMethodResponse getPaymentMethodById(Long id) {
        User user = currentUser.getUser();
        PaymentMethod method = paymentMethodRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment method not found"));
        return paymentMethodMapper.toResponse(method);
    }

    @Transactional
    public void deletePaymentMethod(Long id) {
        User user = currentUser.getUser();
        PaymentMethod method = paymentMethodRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment method not found"));

        // If this is the default card, assign default to another active card
        if (method.getIsDefault()) {
            List<PaymentMethod> otherCards = paymentMethodRepository.findByUserIdAndIsActiveTrue(user.getId())
                    .stream()
                    .filter(pm -> !pm.getId().equals(id))
                    .collect(Collectors.toList());

            if (!otherCards.isEmpty()) {
                otherCards.get(0).setIsDefault(true);
                paymentMethodRepository.save(otherCards.get(0));
            }
        }

        paymentMethodRepository.deleteById(id);
    }

    @Transactional
    public PaymentMethodResponse setDefaultPaymentMethod(Long id) {
        User user = currentUser.getUser();
        PaymentMethod method = paymentMethodRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment method not found"));

        // Unset current default if it exists
        paymentMethodRepository.findByUserIdAndIsDefaultTrue(user.getId())
                .ifPresent(pm -> {
                    if (!pm.getId().equals(id)) {
                        pm.setIsDefault(false);
                        paymentMethodRepository.save(pm);
                    }
                });

        method.setIsDefault(true);
        PaymentMethod updated = paymentMethodRepository.save(method);
        return paymentMethodMapper.toResponse(updated);
    }

    @Transactional(readOnly = true)
    public PaymentMethodResponse getDefaultPaymentMethod() {
        User user = currentUser.getUser();
        PaymentMethod method = paymentMethodRepository.findByUserIdAndIsDefaultTrue(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No default payment method set"));
        return paymentMethodMapper.toResponse(method);
    }

    @Transactional
    public PaymentMethodResponse updatePaymentMethod(Long id, UpdatePaymentMethodRequest request) {
        User user = currentUser.getUser();
        PaymentMethod method = paymentMethodRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment method not found"));

        // Update only specific fields (not card number or last4)
        method.setBrand(request.getBrand());
        method.setExpiryMonth(request.getExpiryMonth());
        method.setExpiryYear(request.getExpiryYear());
        if (request.getCardHolderName() != null && !request.getCardHolderName().isBlank()) {
            method.setCardHolderName(request.getCardHolderName());
        }

        PaymentMethod updated = paymentMethodRepository.save(method);
        return paymentMethodMapper.toResponse(updated);
    }
}

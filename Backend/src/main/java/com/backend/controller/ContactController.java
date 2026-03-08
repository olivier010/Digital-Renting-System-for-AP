package com.backend.controller;

import com.backend.dto.request.ContactRequest;
import com.backend.dto.response.ApiResponse;
import com.backend.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> submitContactForm(@Valid @RequestBody ContactRequest request) {
        contactService.submitContactForm(request);
        return ResponseEntity.ok(ApiResponse.success("Thank you for contacting us! We'll get back to you soon.", null));
    }
}


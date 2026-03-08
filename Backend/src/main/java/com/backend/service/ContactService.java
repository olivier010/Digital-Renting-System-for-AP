package com.backend.service;

import com.backend.dto.request.ContactRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContactService {

    public void submitContactForm(ContactRequest request) {
        log.info("Contact form submitted - Name: {}, Email: {}, Subject: {}, Message: {}",
                request.getName(), request.getEmail(), request.getSubject(), request.getMessage());
    }
}

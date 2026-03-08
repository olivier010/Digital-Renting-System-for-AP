package com.backend.security;

import com.backend.entity.User;
import com.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CurrentUser {

    private final UserRepository userRepository;

    public UserPrincipal getPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            return (UserPrincipal) authentication.getPrincipal();
        }
        return null;
    }

    public Long getUserId() {
        UserPrincipal principal = getPrincipal();
        return principal != null ? principal.getId() : null;
    }

    public User getUser() {
        Long userId = getUserId();
        if (userId != null) {
            return userRepository.findById(userId).orElse(null);
        }
        return null;
    }
}


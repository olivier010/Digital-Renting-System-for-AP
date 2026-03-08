package com.backend.mapper;

import com.backend.dto.response.UserResponse;
import com.backend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        if (user == null) return null;

        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .avatar(user.getAvatar())
                .bio(user.getBio())
                .location(user.getLocation())
                .companyName(user.getCompanyName())
                .taxId(user.getTaxId())
                .isActive(user.getIsActive())
                .isVerified(user.getIsVerified())
                .joinedAt(user.getJoinedAt())
                .lastLogin(user.getLastLogin())
                .build();
    }
}


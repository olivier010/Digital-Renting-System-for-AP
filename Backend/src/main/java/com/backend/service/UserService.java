package com.backend.service;

import com.backend.dto.response.PageResponse;
import com.backend.dto.response.UserResponse;
import com.backend.entity.User;
import com.backend.enums.NotificationEntityType;
import com.backend.enums.NotificationType;
import com.backend.enums.Role;
import com.backend.exception.ResourceNotFoundException;
import com.backend.mapper.UserMapper;
import com.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getAllUsers(Role role, Boolean isActive, String search, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        Page<User> userPage = userRepository.findByFilters(role, isActive, search, pageable);
        return toPageResponse(userPage);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse updateUser(Long id, Role role, Boolean isActive) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        Boolean previousStatus = user.getIsActive();
        if (role != null) {
            user.setRole(role);
        }
        if (isActive != null) {
            user.setIsActive(isActive);
        }

        user = userRepository.save(user);

        if (isActive != null && (previousStatus == null || !previousStatus.equals(isActive))) {
            notificationService.notifyUser(
                    user,
                    isActive ? NotificationType.USER_APPROVED : NotificationType.USER_REJECTED,
                    isActive ? "Account approved" : "Account status updated",
                    isActive
                            ? "Your account has been approved. You can now log in."
                            : "Your account is currently not active. Contact support for more details.",
                    null,
                    NotificationEntityType.USER,
                    user.getId(),
                    "isActive=" + isActive
            );
        }

        return userMapper.toResponse(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User", "id", id);
        }
        userRepository.deleteById(id);
    }

    @Transactional
    public UserResponse updateUserStatus(Long id, Boolean isActive) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        Boolean previousStatus = user.getIsActive();
        user.setIsActive(isActive);
        user = userRepository.save(user);

        if (previousStatus == null || !previousStatus.equals(isActive)) {
            notificationService.notifyUser(
                    user,
                    Boolean.TRUE.equals(isActive) ? NotificationType.USER_APPROVED : NotificationType.USER_REJECTED,
                    Boolean.TRUE.equals(isActive) ? "Account approved" : "Account status updated",
                    Boolean.TRUE.equals(isActive)
                            ? "Your account has been approved. You can now log in."
                            : "Your account is currently not active. Contact support for more details.",
                    null,
                    NotificationEntityType.USER,
                    user.getId(),
                    "isActive=" + isActive
            );
        }

        return userMapper.toResponse(user);
    }

    private PageResponse<UserResponse> toPageResponse(Page<User> page) {
        return PageResponse.<UserResponse>builder()
                .content(page.getContent().stream().map(userMapper::toResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }
}


package com.backend.service;

import com.backend.dto.request.ChangePasswordRequest;
import com.backend.dto.request.DeleteAccountRequest;
import com.backend.dto.request.LoginRequest;
import com.backend.dto.request.RegisterRequest;
import com.backend.dto.request.UpdateUserRequest;
import com.backend.dto.response.AuthResponse;
import com.backend.dto.response.UserDataExportResponse;
import com.backend.dto.response.UserResponse;
import com.backend.entity.User;
import com.backend.entity.Log;
import com.backend.enums.NotificationEntityType;
import com.backend.enums.NotificationType;
import com.backend.enums.Role;
import com.backend.exception.BadRequestException;
import com.backend.exception.DuplicateResourceException;
import com.backend.exception.ResourceNotFoundException;
import com.backend.mapper.UserMapper;
import com.backend.repository.BookingRepository;
import com.backend.repository.FavoriteRepository;
import com.backend.repository.NotificationRepository;
import com.backend.repository.PaymentMethodRepository;
import com.backend.repository.PaymentRepository;
import com.backend.repository.PropertyRepository;
import com.backend.repository.ReviewRepository;
import com.backend.repository.UserRepository;
import com.backend.security.CurrentUser;
import com.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;
    private final CurrentUser currentUser;
    private final LogService logService;
    private final NotificationService notificationService;
    private final BookingRepository bookingRepository;
    private final FavoriteRepository favoriteRepository;
    private final ReviewRepository reviewRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final PropertyRepository propertyRepository;
    private final NotificationRepository notificationRepository;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered");
        }

        Role role;
        try {
            role = Role.valueOf(request.getRole().toUpperCase());
            if (role == Role.ADMIN) {
                throw new BadRequestException("Admin accounts cannot be self-registered");
            }
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role. Must be RENTER or OWNER");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(role)
                .isActive(false) // Require admin approval
                .isVerified(false)
                .build();

        user = userRepository.save(user);
        logService.saveLog(Log.builder()
            .level("INFO")
            .message("User registered: " + user.getEmail())
            .timestamp(LocalDateTime.now())
            .build());

        notificationService.notifyRole(
                Role.ADMIN,
                NotificationType.USER_PENDING_APPROVAL,
                "New user pending approval",
                "User " + user.getEmail() + " registered and is waiting for approval.",
                user.getId(),
                NotificationEntityType.USER,
                user.getId(),
                null
        );

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .user(userMapper.toResponse(user))
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));
            if (!user.getIsActive()) {
                throw new BadRequestException("Account not yet approved by admin.");
            }
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            String token = jwtTokenProvider.generateToken(authentication);
            logService.saveLog(Log.builder()
                .level("INFO")
                .message("User login success: " + user.getEmail())
                .timestamp(LocalDateTime.now())
                .build());
            return AuthResponse.builder()
                .token(token)
                .user(userMapper.toResponse(user))
                .build();
        } catch (Exception ex) {
            logService.saveLog(Log.builder()
                .level("WARN")
                .message("User login failed: " + request.getEmail() + ", reason: " + ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build());
            throw ex;
        }
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser() {
        User user = currentUser.getUser();
        if (user == null) {
            throw new ResourceNotFoundException("User not found");
        }
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse updateCurrentUser(UpdateUserRequest request) {
        User user = currentUser.getUser();
        if (user == null) {
            throw new ResourceNotFoundException("User not found");
        }

        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());

        user = userRepository.save(user);
        return userMapper.toResponse(user);
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        User user = currentUser.getUser();
        if (user == null) {
            throw new ResourceNotFoundException("User not found");
        }

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("New password and confirmation do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public UserDataExportResponse exportCurrentUserData() {
        User user = currentUser.getUser();
        if (user == null) {
            throw new ResourceNotFoundException("User not found");
        }

        Long propertiesCount = propertyRepository.countByOwnerId(user.getId());
        Long bookingsCount = user.getRole() == Role.OWNER
                ? bookingRepository.countByPropertyOwnerId(user.getId())
                : bookingRepository.countByRenterId(user.getId());

        Long favoritesCount = favoriteRepository.countByRenterId(user.getId());
        Long reviewsCount = reviewRepository.countByReviewerId(user.getId());
        Long paymentsCount = paymentRepository.countByRenterId(user.getId());
        Long paymentMethodsCount = paymentMethodRepository.countByUserIdAndIsActiveTrue(user.getId());
        Long notificationsCount = notificationRepository.countByRecipientUserId(user.getId());

        UserDataExportResponse.DataSummary summary = UserDataExportResponse.DataSummary.builder()
                .propertiesCount(propertiesCount)
                .bookingsCount(bookingsCount)
                .favoritesCount(favoritesCount)
                .reviewsCount(reviewsCount)
                .paymentsCount(paymentsCount)
                .paymentMethodsCount(paymentMethodsCount)
                .notificationsCount(notificationsCount)
                .build();

        return UserDataExportResponse.builder()
                .user(userMapper.toResponse(user))
                .summary(summary)
                .exportedAt(LocalDateTime.now())
                .build();
    }

    @Transactional
    public void deleteCurrentUser(DeleteAccountRequest request) {
        User user = currentUser.getUser();
        if (user == null) {
            throw new ResourceNotFoundException("User not found");
        }

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        logService.saveLog(Log.builder()
                .level("WARN")
                .message("User deleted own account: " + user.getEmail())
                .timestamp(LocalDateTime.now())
                .build());

        userRepository.delete(user);
    }
}

package com.backend.config;

import com.backend.entity.User;
import com.backend.enums.Role;
import com.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create admin user if not exists
        if (!userRepository.existsByEmail("admin@rentwise.com")) {
            User admin = User.builder()
                    .firstName("Admin")
                    .lastName("User")
                    .email("admin@rentwise.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .isActive(true)
                    .isVerified(true)
                    .build();
            userRepository.save(admin);
            log.info("Admin user created: admin@rentwise.com / admin123");
        }

        // Create sample owner if not exists
        if (!userRepository.existsByEmail("owner@rentwise.com")) {
            User owner = User.builder()
                    .firstName("John")
                    .lastName("Owner")
                    .email("owner@rentwise.com")
                    .password(passwordEncoder.encode("owner123"))
                    .phone("+250788123456")
                    .role(Role.OWNER)
                    .isActive(true)
                    .isVerified(true)
                    .companyName("RentWise Properties")
                    .build();
            userRepository.save(owner);
            log.info("Owner user created: owner@rentwise.com / owner123");
        }

        // Create sample renter if not exists
        if (!userRepository.existsByEmail("renter@rentwise.com")) {
            User renter = User.builder()
                    .firstName("Jane")
                    .lastName("Renter")
                    .email("renter@rentwise.com")
                    .password(passwordEncoder.encode("renter123"))
                    .phone("+250788654321")
                    .role(Role.RENTER)
                    .isActive(true)
                    .isVerified(true)
                    .build();
            userRepository.save(renter);
            log.info("Renter user created: renter@rentwise.com / renter123");
        }

        log.info("Data initialization completed!");
    }
}


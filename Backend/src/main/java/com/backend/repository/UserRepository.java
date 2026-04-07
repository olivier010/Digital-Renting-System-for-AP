package com.backend.repository;

import com.backend.entity.User;
import com.backend.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Page<User> findByRole(Role role, Pageable pageable);

    List<User> findAllByRole(Role role);

    Page<User> findByIsActive(Boolean isActive, Pageable pageable);

    @Query("SELECT u FROM User u WHERE " +
           "(:role IS NULL OR u.role = :role) AND " +
           "(:isActive IS NULL OR u.isActive = :isActive) AND " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(CAST(u.firstName AS string)) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR " +
           "LOWER(CAST(u.lastName AS string)) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR " +
           "LOWER(CAST(u.email AS string)) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))")
    Page<User> findByFilters(@Param("role") Role role,
                             @Param("isActive") Boolean isActive,
                             @Param("search") String search,
                             Pageable pageable);

    long countByRole(Role role);

    long countByIsActive(Boolean isActive);

    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :start AND u.createdAt < :end")
    long countRegisteredBetween(@Param("start") java.time.LocalDateTime start, @Param("end") java.time.LocalDateTime end);
}

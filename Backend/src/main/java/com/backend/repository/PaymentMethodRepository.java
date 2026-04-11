package com.backend.repository;

import com.backend.entity.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {

    List<PaymentMethod> findByUserId(Long userId);

    List<PaymentMethod> findByUserIdAndIsActiveTrue(Long userId);

    long countByUserIdAndIsActiveTrue(Long userId);

    Optional<PaymentMethod> findByIdAndUserId(Long id, Long userId);

    Optional<PaymentMethod> findByUserIdAndIsDefaultTrue(Long userId);

    @Query("SELECT pm FROM PaymentMethod pm WHERE pm.user.id = :userId AND pm.isActive = true ORDER BY pm.isDefault DESC, pm.createdAt DESC")
    List<PaymentMethod> findActivePaymentMethodsByUserId(@Param("userId") Long userId);

    boolean existsByUserIdAndLast4(Long userId, String last4);
}

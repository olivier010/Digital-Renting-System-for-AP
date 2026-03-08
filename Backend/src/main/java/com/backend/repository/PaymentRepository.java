package com.backend.repository;

import com.backend.entity.Payment;
import com.backend.enums.PaymentStatus;
import com.backend.enums.PaymentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Page<Payment> findByRenterId(Long renterId, Pageable pageable);

    Page<Payment> findByBookingId(Long bookingId, Pageable pageable);

    List<Payment> findByBookingId(Long bookingId);

    Page<Payment> findByStatus(PaymentStatus status, Pageable pageable);

    Page<Payment> findByType(PaymentType type, Pageable pageable);

    @Query("SELECT p FROM Payment p WHERE p.renter.id = :renterId AND " +
           "(:status IS NULL OR p.status = :status) AND " +
           "(:type IS NULL OR p.type = :type)")
    Page<Payment> findByRenterIdAndFilters(@Param("renterId") Long renterId,
                                            @Param("status") PaymentStatus status,
                                            @Param("type") PaymentType type,
                                            Pageable pageable);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED'")
    BigDecimal calculateTotalPayments();

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.renter.id = :renterId AND p.status = 'COMPLETED'")
    BigDecimal calculateTotalPaymentsByRenter(@Param("renterId") Long renterId);

    // Payments for owner's properties
    @Query("SELECT p FROM Payment p WHERE p.booking.property.owner.id = :ownerId")
    Page<Payment> findByOwnerId(@Param("ownerId") Long ownerId, Pageable pageable);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.booking.property.owner.id = :ownerId AND p.status = 'COMPLETED'")
    BigDecimal calculateOwnerEarnings(@Param("ownerId") Long ownerId);
}


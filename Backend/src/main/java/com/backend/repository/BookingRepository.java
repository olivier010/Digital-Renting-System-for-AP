package com.backend.repository;

import com.backend.entity.Booking;
import com.backend.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Page<Booking> findByRenterId(Long renterId, Pageable pageable);

    Page<Booking> findByPropertyId(Long propertyId, Pageable pageable);

    Page<Booking> findByPropertyOwnerId(Long ownerId, Pageable pageable);

    Page<Booking> findByStatus(BookingStatus status, Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE " +
           "(:status IS NULL OR b.status = :status) AND " +
           "(:startDate IS NULL OR b.startDate >= :startDate) AND " +
           "(:endDate IS NULL OR b.endDate <= :endDate)")
    Page<Booking> findByFilters(@Param("status") BookingStatus status,
                                 @Param("startDate") LocalDate startDate,
                                 @Param("endDate") LocalDate endDate,
                                 Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE b.renter.id = :renterId AND " +
           "(:status IS NULL OR b.status = :status)")
    Page<Booking> findByRenterIdAndStatus(@Param("renterId") Long renterId,
                                           @Param("status") BookingStatus status,
                                           Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE b.property.owner.id = :ownerId AND " +
           "(:status IS NULL OR b.status = :status)")
    Page<Booking> findByOwnerIdAndStatus(@Param("ownerId") Long ownerId,
                                          @Param("status") BookingStatus status,
                                          Pageable pageable);

    // Check for overlapping bookings
    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM Booking b WHERE " +
           "b.property.id = :propertyId AND " +
           "b.status NOT IN ('CANCELLED') AND " +
           "((b.startDate <= :endDate AND b.endDate >= :startDate))")
    boolean existsOverlappingBooking(@Param("propertyId") Long propertyId,
                                      @Param("startDate") LocalDate startDate,
                                      @Param("endDate") LocalDate endDate);

    long countByStatus(BookingStatus status);

    long countByRenterId(Long renterId);

    long countByPropertyOwnerId(Long ownerId);

    @Query("SELECT SUM(b.totalPrice) FROM Booking b WHERE b.status = 'COMPLETED'")
    BigDecimal calculateTotalRevenue();

    @Query("SELECT SUM(b.totalPrice) FROM Booking b WHERE b.property.owner.id = :ownerId AND b.status = 'COMPLETED'")
    BigDecimal calculateOwnerRevenue(@Param("ownerId") Long ownerId);

    // Find bookings that need reviews (completed but no review)
    @Query("SELECT b FROM Booking b WHERE b.renter.id = :renterId AND b.status = 'COMPLETED' AND b.review IS NULL")
    List<Booking> findBookingsAwaitingReview(@Param("renterId") Long renterId);
}


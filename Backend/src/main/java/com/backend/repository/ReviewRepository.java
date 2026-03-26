package com.backend.repository;

import com.backend.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByPropertyId(Long propertyId, Pageable pageable);

    Page<Review> findByReviewerId(Long reviewerId, Pageable pageable);

    Optional<Review> findByBookingId(Long bookingId);

    boolean existsByBookingId(Long bookingId);

    @Query("SELECT AVG(r.overallRating) FROM Review r WHERE r.property.id = :propertyId")
    Double calculateAverageRating(@Param("propertyId") Long propertyId);

    long countByPropertyId(Long propertyId);

    long countByReviewerId(Long reviewerId);

    // Find reviews for owner's properties
    @Query("SELECT r FROM Review r WHERE r.property.owner.id = :ownerId")
    Page<Review> findByPropertyOwnerId(@Param("ownerId") Long ownerId, Pageable pageable);

    @Query("SELECT AVG(r.overallRating) FROM Review r WHERE r.createdAt >= :start AND r.createdAt < :end")
    Double averageRatingBetween(@Param("start") java.time.LocalDateTime start, @Param("end") java.time.LocalDateTime end);
}

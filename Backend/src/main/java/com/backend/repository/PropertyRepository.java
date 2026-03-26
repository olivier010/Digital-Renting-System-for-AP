package com.backend.repository;

import com.backend.entity.Property;
import com.backend.enums.PropertyCategory;
import com.backend.enums.PropertyStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {

    Page<Property> findByOwnerId(Long ownerId, Pageable pageable);

    List<Property> findByOwnerIdAndStatus(Long ownerId, PropertyStatus status);

    Page<Property> findByIsFeaturedTrue(Pageable pageable);

    Page<Property> findByIsAvailableTrue(Pageable pageable);

    Page<Property> findByCategory(PropertyCategory category, Pageable pageable);

    Page<Property> findByStatus(PropertyStatus status, Pageable pageable);

    @Query("SELECT p FROM Property p WHERE " +
           "(:category IS NULL OR p.category = :category) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:location IS NULL OR :location = '' OR LOWER(CAST(p.location AS string)) LIKE LOWER(CONCAT('%', CAST(:location AS string), '%'))) AND " +
           "(:available IS NULL OR p.isAvailable = :available) AND " +
           "p.status = com.backend.enums.PropertyStatus.ACTIVE")
    Page<Property> findByFilters(@Param("category") PropertyCategory category,
                                  @Param("minPrice") BigDecimal minPrice,
                                  @Param("maxPrice") BigDecimal maxPrice,
                                  @Param("location") String location,
                                  @Param("available") Boolean available,
                                  Pageable pageable);

    @Query("SELECT p FROM Property p WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(CAST(p.title AS string)) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR " +
           "LOWER(CAST(p.description AS string)) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR " +
           "LOWER(CAST(p.location AS string)) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%'))) AND " +
           "p.status = com.backend.enums.PropertyStatus.ACTIVE")
    Page<Property> searchProperties(@Param("search") String search, Pageable pageable);

    long countByOwnerId(Long ownerId);

    long countByStatus(PropertyStatus status);

    long countByCategory(PropertyCategory category);

    @Query("SELECT COUNT(p) FROM Property p WHERE p.owner.id = :ownerId AND p.status = :status")
    long countByOwnerIdAndStatus(@Param("ownerId") Long ownerId, @Param("status") PropertyStatus status);

    @Query("SELECT COUNT(p) FROM Property p WHERE p.createdAt >= :start AND p.createdAt < :end")
    long countCreatedBetween(@Param("start") java.time.LocalDateTime start, @Param("end") java.time.LocalDateTime end);
}

package com.backend.repository;

import com.backend.entity.Favorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    Page<Favorite> findByRenterId(Long renterId, Pageable pageable);

    Optional<Favorite> findByRenterIdAndPropertyId(Long renterId, Long propertyId);

    boolean existsByRenterIdAndPropertyId(Long renterId, Long propertyId);

    void deleteByRenterIdAndPropertyId(Long renterId, Long propertyId);

    long countByRenterId(Long renterId);

    long countByPropertyId(Long propertyId);
}


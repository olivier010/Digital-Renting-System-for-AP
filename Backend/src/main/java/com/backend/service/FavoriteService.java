package com.backend.service;

import com.backend.dto.response.FavoriteResponse;
import com.backend.dto.response.PageResponse;
import com.backend.entity.Favorite;
import com.backend.entity.Property;
import com.backend.entity.User;
import com.backend.exception.DuplicateResourceException;
import com.backend.exception.ResourceNotFoundException;
import com.backend.exception.UnauthorizedException;
import com.backend.mapper.FavoriteMapper;
import com.backend.repository.FavoriteRepository;
import com.backend.repository.PropertyRepository;
import com.backend.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final PropertyRepository propertyRepository;
    private final FavoriteMapper favoriteMapper;
    private final CurrentUser currentUser;

    @Transactional(readOnly = true)
    public PageResponse<FavoriteResponse> getCurrentUserFavorites(int page, int size) {
        User user = currentUser.getUser();
        if (user == null) {
            throw new UnauthorizedException("You must be logged in");
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("savedAt").descending());
        Page<Favorite> favoritePage = favoriteRepository.findByRenterId(user.getId(), pageable);

        return toPageResponse(favoritePage);
    }

    @Transactional
    public FavoriteResponse addToFavorites(Long propertyId) {
        User user = currentUser.getUser();
        if (user == null) {
            throw new UnauthorizedException("You must be logged in");
        }

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));

        // Check if already favorited
        if (favoriteRepository.existsByRenterIdAndPropertyId(user.getId(), propertyId)) {
            throw new DuplicateResourceException("Property already in favorites");
        }

        Favorite favorite = Favorite.builder()
                .renter(user)
                .property(property)
                .build();

        favorite = favoriteRepository.save(favorite);

        // Update property saves count
        property.setSavesCount(property.getSavesCount() + 1);
        propertyRepository.save(property);

        return favoriteMapper.toResponse(favorite);
    }

    @Transactional
    public void removeFromFavorites(Long propertyId) {
        User user = currentUser.getUser();
        if (user == null) {
            throw new UnauthorizedException("You must be logged in");
        }

        Favorite favorite = favoriteRepository.findByRenterIdAndPropertyId(user.getId(), propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Favorite not found"));

        Property property = favorite.getProperty();

        favoriteRepository.delete(favorite);

        // Update property saves count
        property.setSavesCount(Math.max(0, property.getSavesCount() - 1));
        propertyRepository.save(property);
    }

    @Transactional(readOnly = true)
    public boolean isFavorited(Long propertyId) {
        User user = currentUser.getUser();
        if (user == null) {
            return false;
        }
        return favoriteRepository.existsByRenterIdAndPropertyId(user.getId(), propertyId);
    }

    private PageResponse<FavoriteResponse> toPageResponse(Page<Favorite> page) {
        return PageResponse.<FavoriteResponse>builder()
                .content(page.getContent().stream().map(favoriteMapper::toResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }
}


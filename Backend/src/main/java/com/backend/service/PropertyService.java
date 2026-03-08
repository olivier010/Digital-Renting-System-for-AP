package com.backend.service;

import com.backend.dto.request.CreatePropertyRequest;
import com.backend.dto.request.UpdatePropertyRequest;
import com.backend.dto.response.PageResponse;
import com.backend.dto.response.PropertyResponse;
import com.backend.entity.Property;
import com.backend.entity.User;
import com.backend.enums.PropertyCategory;
import com.backend.enums.PropertyStatus;
import com.backend.exception.BadRequestException;
import com.backend.exception.ResourceNotFoundException;
import com.backend.exception.UnauthorizedException;
import com.backend.mapper.PropertyMapper;
import com.backend.repository.PropertyRepository;
import com.backend.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final PropertyMapper propertyMapper;
    private final CurrentUser currentUser;

    @Transactional(readOnly = true)
    public PageResponse<PropertyResponse> getAllProperties(PropertyCategory category, BigDecimal minPrice,
                                                            BigDecimal maxPrice, String location, Boolean available,
                                                            int page, int size, String sortBy) {
        Sort sort = getSortOrder(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Property> propertyPage = propertyRepository.findByFilters(category, minPrice, maxPrice, location, available, pageable);

        return toPageResponse(propertyPage);
    }

    @Transactional(readOnly = true)
    public PageResponse<PropertyResponse> searchProperties(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Property> propertyPage = propertyRepository.searchProperties(search, pageable);

        return toPageResponse(propertyPage);
    }

    @Transactional
    public PropertyResponse getPropertyById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));

        // Increment view count
        property.setViewsCount(property.getViewsCount() + 1);
        propertyRepository.save(property);

        return propertyMapper.toResponse(property);
    }

    @Transactional(readOnly = true)
    public PageResponse<PropertyResponse> getFeaturedProperties(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Property> propertyPage = propertyRepository.findByIsFeaturedTrue(pageable);

        return toPageResponse(propertyPage);
    }

    @Transactional(readOnly = true)
    public PageResponse<PropertyResponse> getOwnerProperties(Long ownerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Property> propertyPage = propertyRepository.findByOwnerId(ownerId, pageable);

        return toPageResponse(propertyPage);
    }

    @Transactional
    public PropertyResponse createProperty(CreatePropertyRequest request) {
        User owner = currentUser.getUser();
        if (owner == null) {
            throw new UnauthorizedException("You must be logged in to create a property");
        }

        PropertyCategory category;
        try {
            category = PropertyCategory.valueOf(request.getCategory().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid category");
        }

        Property property = Property.builder()
                .owner(owner)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(category)
                .location(request.getLocation())
                .price(request.getPrice())
                .images(request.getImages() != null ? request.getImages() : java.util.Collections.emptyList())
                .rules(request.getRules())
                .status(PropertyStatus.ACTIVE)
                .isAvailable(true)
                .build();

        property = propertyRepository.save(property);
        return propertyMapper.toResponse(property);
    }

    @Transactional
    public PropertyResponse updateProperty(Long id, UpdatePropertyRequest request) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));

        // Check ownership
        User currentUserEntity = currentUser.getUser();
        if (currentUserEntity == null ||
            (!property.getOwner().getId().equals(currentUserEntity.getId()) &&
             !currentUserEntity.getRole().name().equals("ADMIN"))) {
            throw new UnauthorizedException("You can only update your own properties");
        }

        if (request.getTitle() != null) {
            property.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            property.setDescription(request.getDescription());
        }
        if (request.getCategory() != null) {
            try {
                property.setCategory(PropertyCategory.valueOf(request.getCategory().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid category");
            }
        }
        if (request.getLocation() != null) {
            property.setLocation(request.getLocation());
        }
        if (request.getPrice() != null) {
            property.setPrice(request.getPrice());
        }
        if (request.getIsAvailable() != null) {
            property.setIsAvailable(request.getIsAvailable());
        }
        if (request.getStatus() != null) {
            try {
                property.setStatus(PropertyStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid status");
            }
        }
        if (request.getImages() != null) {
            property.setImages(request.getImages());
        }
        if (request.getRules() != null) {
            property.setRules(request.getRules());
        }

        property = propertyRepository.save(property);
        return propertyMapper.toResponse(property);
    }

    @Transactional
    public void deleteProperty(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));

        // Check ownership
        User currentUserEntity = currentUser.getUser();
        if (currentUserEntity == null ||
            (!property.getOwner().getId().equals(currentUserEntity.getId()) &&
             !currentUserEntity.getRole().name().equals("ADMIN"))) {
            throw new UnauthorizedException("You can only delete your own properties");
        }

        propertyRepository.delete(property);
    }

    @Transactional
    public PropertyResponse updatePropertyStatus(Long id, PropertyStatus status) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));

        property.setStatus(status);
        property = propertyRepository.save(property);
        return propertyMapper.toResponse(property);
    }

    @Transactional
    public PropertyResponse toggleFeatured(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));

        property.setIsFeatured(!property.getIsFeatured());
        property = propertyRepository.save(property);
        return propertyMapper.toResponse(property);
    }

    private Sort getSortOrder(String sortBy) {
        if (sortBy == null) return Sort.by("createdAt").descending();

        return switch (sortBy.toLowerCase()) {
            case "price_asc" -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "rating" -> Sort.by("rating").descending();
            case "newest" -> Sort.by("createdAt").descending();
            default -> Sort.by("createdAt").descending();
        };
    }

    private PageResponse<PropertyResponse> toPageResponse(Page<Property> page) {
        return PageResponse.<PropertyResponse>builder()
                .content(page.getContent().stream().map(propertyMapper::toResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }
}


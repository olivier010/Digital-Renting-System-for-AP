package com.backend.controller;

import com.backend.dto.request.CreatePropertyRequest;
import com.backend.dto.request.UpdatePropertyRequest;
import com.backend.dto.response.ApiResponse;
import com.backend.dto.response.PageResponse;
import com.backend.dto.response.PropertyResponse;
import com.backend.enums.PropertyCategory;
import com.backend.enums.PropertyStatus;
import com.backend.service.PropertyService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PropertyResponse>>> getAllProperties(
            @RequestParam(required = false) PropertyCategory category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Boolean available,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sort) {

        PageResponse<PropertyResponse> response = propertyService.getAllProperties(
                category, minPrice, maxPrice, location, available, page, size, sort);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<PropertyResponse>>> searchProperties(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageResponse<PropertyResponse> response = propertyService.searchProperties(q, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyResponse>> getPropertyById(@PathVariable Long id) {
        PropertyResponse response = propertyService.getPropertyById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<PageResponse<PropertyResponse>>> getFeaturedProperties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageResponse<PropertyResponse> response = propertyService.getFeaturedProperties(page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/owner/{ownerId}")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<PropertyResponse>>> getOwnerProperties(
            @PathVariable Long ownerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageResponse<PropertyResponse> response = propertyService.getOwnerProperties(ownerId, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Create a property with image upload. Accepts any file type for images (no content type restrictions).
     * The frontend should send a multipart/form-data request with:
     * - property: JSON (as a string)
     * - images: one or more files (any content type)
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<PropertyResponse>> createProperty(
            @RequestPart("property") String propertyJson,
            @RequestPart(value = "images", required = false) java.util.List<MultipartFile> images) {
        // Manually deserialize property JSON
        CreatePropertyRequest request;
        try {
            request = objectMapper.readValue(propertyJson, CreatePropertyRequest.class);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(HttpStatus.BAD_REQUEST.value(), "Invalid property JSON: " + e.getMessage()));
        }
        PropertyResponse response = propertyService.createProperty(request, images);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<PropertyResponse>> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePropertyRequest request) {

        PropertyResponse response = propertyService.updateProperty(id, request);
        return ResponseEntity.ok(ApiResponse.success("Property updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.ok(ApiResponse.success("Property deleted successfully", null));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PropertyResponse>> updatePropertyStatus(
            @PathVariable Long id,
            @RequestParam PropertyStatus status) {

        PropertyResponse response = propertyService.updatePropertyStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Property status updated successfully", response));
    }

    @PatchMapping("/{id}/featured")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    public ResponseEntity<ApiResponse<PropertyResponse>> toggleFeatured(@PathVariable Long id) {
        PropertyResponse response = propertyService.toggleFeatured(id);
        return ResponseEntity.ok(ApiResponse.success("Property featured status toggled", response));
    }
}

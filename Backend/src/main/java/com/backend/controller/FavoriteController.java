package com.backend.controller;

import com.backend.dto.request.PropertyIdRequest;
import com.backend.dto.response.ApiResponse;
import com.backend.dto.response.FavoriteResponse;
import com.backend.dto.response.PageResponse;
import com.backend.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RENTER')")
public class FavoriteController {
    private final FavoriteService favoriteService;

    @PostMapping
    public ResponseEntity<ApiResponse<FavoriteResponse>> addToFavorites(@RequestBody PropertyIdRequest request) {
        FavoriteResponse response = favoriteService.addToFavorites(request.getPropertyId());
        return ResponseEntity.ok(ApiResponse.success("Property added to favorites", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<FavoriteResponse>>> getFavorites(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<FavoriteResponse> response = favoriteService.getCurrentUserFavorites(page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/{propertyId}")
    public ResponseEntity<ApiResponse<Void>> removeFromFavorites(@PathVariable Long propertyId) {
        favoriteService.removeFromFavorites(propertyId);
        return ResponseEntity.ok(ApiResponse.success("Property removed from favorites", null));
    }
}

package com.backend.controller;

import com.backend.dto.request.CreateBookingRequest;
import com.backend.dto.request.UpdateBookingRequest;
import com.backend.dto.response.ApiResponse;
import com.backend.dto.response.BookingResponse;
import com.backend.dto.response.PageResponse;
import com.backend.enums.BookingStatus;
import com.backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<BookingResponse>>> getAllBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageResponse<BookingResponse> response = bookingService.getAllBookings(status, startDate, endDate, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(@PathVariable Long id) {
        BookingResponse response = bookingService.getBookingById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/renter/{renterId}")
    @PreAuthorize("hasAnyRole('RENTER', 'ADMIN') and (#renterId == authentication.principal.id or hasRole('ADMIN'))")
    public ResponseEntity<ApiResponse<PageResponse<BookingResponse>>> getRenterBookings(
            @PathVariable Long renterId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageResponse<BookingResponse> response = bookingService.getRenterBookings(renterId, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/property/{propertyId}")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<BookingResponse>>> getPropertyBookings(
            @PathVariable Long propertyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageResponse<BookingResponse> response = bookingService.getPropertyBookings(propertyId, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    @PreAuthorize("hasRole('RENTER')")
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody CreateBookingRequest request) {

        BookingResponse response = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBooking(
            @PathVariable Long id,
            @Valid @RequestBody UpdateBookingRequest request) {

        BookingResponse response = bookingService.updateBooking(id, request);
        return ResponseEntity.ok(ApiResponse.success("Booking updated successfully", response));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam BookingStatus status,
            @RequestParam(required = false) String cancellationReason) {

        BookingResponse response = bookingService.updateBookingStatus(id, status, cancellationReason);
        return ResponseEntity.ok(ApiResponse.success("Booking status updated successfully", response));
    }

    @GetMapping("/pending-review")
    @PreAuthorize("hasRole('RENTER')")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getBookingsAwaitingReview() {
        // This would need current user id from security context
        // For now, simplified implementation
        return ResponseEntity.ok(ApiResponse.success(List.of()));
    }
}


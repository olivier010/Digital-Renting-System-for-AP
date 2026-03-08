package com.backend.mapper;

import com.backend.dto.response.BookingResponse;
import com.backend.entity.Booking;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

    public BookingResponse toResponse(Booking booking) {
        if (booking == null) return null;

        return BookingResponse.builder()
                .id(booking.getId())
                .property(toPropertyInfo(booking))
                .renter(toRenterInfo(booking))
                .startDate(booking.getStartDate())
                .endDate(booking.getEndDate())
                .guests(booking.getGuests())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus().name())
                .paymentStatus(booking.getPaymentStatus().name())
                .specialRequests(booking.getSpecialRequests())
                .cancellationReason(booking.getCancellationReason())
                .cancellationPolicy(booking.getCancellationPolicy())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }

    private BookingResponse.PropertyInfo toPropertyInfo(Booking booking) {
        if (booking.getProperty() == null) return null;

        return BookingResponse.PropertyInfo.builder()
                .id(booking.getProperty().getId())
                .title(booking.getProperty().getTitle())
                .location(booking.getProperty().getLocation())
                .category(booking.getProperty().getCategory().name())
                .price(booking.getProperty().getPrice())
                .image(booking.getProperty().getImages().isEmpty() ? null : booking.getProperty().getImages().get(0))
                .ownerId(booking.getProperty().getOwner().getId())
                .ownerName(booking.getProperty().getOwner().getFullName())
                .build();
    }

    private BookingResponse.RenterInfo toRenterInfo(Booking booking) {
        if (booking.getRenter() == null) return null;

        return BookingResponse.RenterInfo.builder()
                .id(booking.getRenter().getId())
                .name(booking.getRenter().getFullName())
                .email(booking.getRenter().getEmail())
                .phone(booking.getRenter().getPhone())
                .avatar(booking.getRenter().getAvatar())
                .build();
    }
}


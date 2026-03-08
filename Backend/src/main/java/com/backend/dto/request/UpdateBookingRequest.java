package com.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBookingRequest {

    private LocalDate startDate;

    private LocalDate endDate;

    private Integer guests;

    private String specialRequests;

    private String status;

    private String cancellationReason;
}


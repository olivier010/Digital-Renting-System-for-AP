package com.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyEarningsResponse {
    private Long propertyId;
    private String propertyTitle;
    private BigDecimal totalRevenue;
    private Integer bookingsCount;
    private Double occupancyRate;
    private BigDecimal averagePrice;
    private Double growth;
}


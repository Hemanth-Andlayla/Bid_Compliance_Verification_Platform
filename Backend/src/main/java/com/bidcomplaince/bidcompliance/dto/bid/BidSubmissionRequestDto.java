package com.bidcomplaince.bidcompliance.dto.bid;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class BidSubmissionRequestDto {

    @NotNull(message = "Tender ID is required")
    private Long tenderId;

    @NotNull(message = "Quoted price is required")
    @DecimalMin(
            value = "0.01",
            message = "Quoted price must be greater than zero"
    )
    private BigDecimal quotedPrice;

    @NotNull(message = "Bidder details are required")
    @Valid
    private BidderDetailsRequestDto bidderDetails;
}
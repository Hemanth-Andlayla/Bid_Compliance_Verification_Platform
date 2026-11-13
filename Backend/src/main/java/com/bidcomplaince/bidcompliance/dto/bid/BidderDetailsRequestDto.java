package com.bidcomplaince.bidcompliance.dto.bid;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BidderDetailsRequestDto {

    @NotBlank(message = "Bidder name is required")
    private String name;

    @NotBlank(message = "PAN is required")
    private String pan;

    @NotBlank(message = "GSTIN is required")
    private String gstin;

    private String udyamNumber;

    @NotBlank(message = "Address is required")
    private String address;
}
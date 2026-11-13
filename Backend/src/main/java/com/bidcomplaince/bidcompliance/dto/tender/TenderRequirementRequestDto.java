package com.bidcomplaince.bidcompliance.dto.tender;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TenderRequirementRequestDto {

    @NotBlank(message = "Requirement type is required")
    private String requirementType;

    @NotBlank(message = "Requirement description is required")
    private String description;

    @NotNull(message = "Mandatory field is required")
    private Boolean mandatory;
}
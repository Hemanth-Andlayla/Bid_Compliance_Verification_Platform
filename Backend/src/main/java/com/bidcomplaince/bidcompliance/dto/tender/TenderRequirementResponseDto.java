package com.bidcomplaince.bidcompliance.dto.tender;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TenderRequirementResponseDto {

    private Long id;
    private String requirementType;
    private String description;
    private Boolean mandatory;
}
package com.bidcomplaince.bidcompliance.dto.officer;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OfficerDecisionRequestDto {

    @NotBlank(message = "Decision is required")
    private String decision;

    private String remarks;
}
package com.bidcomplaince.bidcompliance.dto.tender;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
public class TenderCreateRequestDto {

    @NotBlank(message = "Tender title is required")
    private String title;

    @NotBlank(message = "Tender description is required")
    private String description;

    @NotNull(message = "Submission deadline is required")
    @Future(message = "Submission deadline must be in the future")
    private Instant submissionDeadline;

    @Valid
    private List<TenderRequirementRequestDto> requirements;
}
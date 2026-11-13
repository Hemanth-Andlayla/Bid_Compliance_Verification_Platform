package com.bidcomplaince.bidcompliance.dto.tender;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
public class TenderResponseDto {

    private Long id;
    private String title;
    private String description;
    private Long createdBy;
    private String organization;
    private Instant submissionDeadline;
    private String status;
    private Instant createdAt;
    private Instant updatedAt;
    private List<TenderRequirementResponseDto> requirements;




}
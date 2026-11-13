package com.bidcomplaince.bidcompliance.dto.compliance;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ComplianceResultResponseDto {

    private Long id;
    private Long bidId;
    private Long requirementId;
    private Long documentId;
    private String status;
    private String reason;
    private Instant checkedAt;
}
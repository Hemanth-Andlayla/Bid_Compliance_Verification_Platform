package com.bidcomplaince.bidcompliance.dto.officer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
public class OfficerDecisionResponseDto {

    private Long id;
    private Long bidId;
    private Long officerId;
    private String decision;
    private String remarks;
    private Instant decidedAt;
}
package com.bidcomplaince.bidcompliance.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.Instant;
import java.util.List;

@Getter
@AllArgsConstructor
public class AiSummaryResponseDto {

    private Long id;

    private Long bidId;

    private String summary;

    private List<String> keyFindings;

    private String riskLevel;

    private String recommendation;

    private Instant generatedAt;
}
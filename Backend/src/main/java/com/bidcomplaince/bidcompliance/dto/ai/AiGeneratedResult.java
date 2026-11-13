package com.bidcomplaince.bidcompliance.dto.ai;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class AiGeneratedResult {

    private String summary;

    private List<String> keyFindings;

    private String riskLevel;

    private String recommendation;
}
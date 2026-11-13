package com.bidcomplaince.bidcompliance.service;

import com.bidcomplaince.bidcompliance.dto.ai.AiSummaryResponseDto;

public interface AiAnalysisService {

    AiSummaryResponseDto analyzeBid(Long bidId);

    AiSummaryResponseDto getSummaryByBidId(Long bidId);
}
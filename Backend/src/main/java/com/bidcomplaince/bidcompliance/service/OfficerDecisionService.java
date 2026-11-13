package com.bidcomplaince.bidcompliance.service;

import com.bidcomplaince.bidcompliance.dto.officer.OfficerDecisionRequestDto;
import com.bidcomplaince.bidcompliance.dto.officer.OfficerDecisionResponseDto;

public interface OfficerDecisionService {

    OfficerDecisionResponseDto submitDecision(
            Long bidId,
            Long officerId,
            OfficerDecisionRequestDto request
    );

    OfficerDecisionResponseDto
    getDecisionByBidId(Long bidId);
}
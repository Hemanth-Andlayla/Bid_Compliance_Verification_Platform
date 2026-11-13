package com.bidcomplaince.bidcompliance.service;

import com.bidcomplaince.bidcompliance.entity.ComplianceResult;

import java.util.List;

public interface ComplianceService {

    ComplianceResult getComplianceResultById(Long id);

    List<ComplianceResult> getResultsByBidId(Long bidId);

    ComplianceResult saveComplianceResult(ComplianceResult result);

    void checkCompliance(Long bidId);
}

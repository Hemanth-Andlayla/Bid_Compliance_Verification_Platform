package com.bidcomplaince.bidcompliance.service;

import com.bidcomplaince.bidcompliance.entity.CrossVerificationResult;

import java.util.List;

public interface CrossVerificationService {

    CrossVerificationResult getCrossVerificationResultById(Long id);

    CrossVerificationResult getResultByBidId(Long bidId);

    CrossVerificationResult saveCrossVerificationResult(
            CrossVerificationResult result
    );

    void performCrossVerification(Long bidId);
}

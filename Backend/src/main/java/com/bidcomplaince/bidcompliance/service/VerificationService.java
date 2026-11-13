package com.bidcomplaince.bidcompliance.service;

import com.bidcomplaince.bidcompliance.entity.VerificationResult;

import java.util.List;

public interface VerificationService {

    VerificationResult getVerificationResultById(Long id);

    void verifyBid(Long bidId);
}


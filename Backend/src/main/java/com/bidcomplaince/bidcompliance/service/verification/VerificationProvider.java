package com.bidcomplaince.bidcompliance.service.verification;

import java.util.Map;

public interface VerificationProvider {

    boolean supports(String documentType);

    VerificationResponse verify(
            Map<String, Object> extractedFields
    );
}
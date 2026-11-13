package com.bidcomplaince.bidcompliance.service.verification;

import java.util.Map;

public record VerificationResponse(
        String status,
        Map<String, Object> verifiedData,
        String reason
) {
}
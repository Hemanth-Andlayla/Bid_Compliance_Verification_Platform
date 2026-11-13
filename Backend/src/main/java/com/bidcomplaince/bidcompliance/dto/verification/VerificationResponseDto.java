package com.bidcomplaince.bidcompliance.dto.verification;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.Map;

@Getter
@Setter
public class VerificationResponseDto {

    private Long id;
    private Long bidId;
    private Long documentId;
    private String verificationSource;
    private String status;
    private Map<String, Object> verifiedData;
    private String reason;
    private Instant verifiedAt;
}
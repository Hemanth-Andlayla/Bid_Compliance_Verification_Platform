package com.bidcompliance.verificationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VerificationResponseDto {

    private boolean verified;

    private String status;

    private String reason;

    private Map<String, Object> verifiedData;
}

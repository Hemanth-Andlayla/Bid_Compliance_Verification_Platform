package com.bidcompliance.verificationservice.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PanVerificationRequestDto {

    private String pan;
    private String name;
}

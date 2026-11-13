package com.bidcompliance.verificationservice.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GstVerificationRequestDto {

    private String gstin;
    private String name;
    private String address;
}
package com.bidcompliance.verificationservice.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UdyamVerificationRequestDto {

    private String udyamNumber;
    private String name;
    private String address;
}
package com.bidcomplaince.bidcompliance.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
public class UserResponseDto {

    private Long id;
    private String name;
    private String email;
    private String organization;
    private Instant createdAt;
    private Instant updatedAt;
}
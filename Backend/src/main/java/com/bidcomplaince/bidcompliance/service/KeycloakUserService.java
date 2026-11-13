package com.bidcomplaince.bidcompliance.service;

import com.bidcomplaince.bidcompliance.dto.user.RegisterRequestDto;

public interface KeycloakUserService {

    String createUser(RegisterRequestDto request);
}
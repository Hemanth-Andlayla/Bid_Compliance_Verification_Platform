package com.bidcomplaince.bidcompliance.service;

import com.bidcomplaince.bidcompliance.dto.user.RegisterRequestDto;
import com.bidcomplaince.bidcompliance.dto.user.UserResponseDto;

import java.util.List;

public interface UserService {

    UserResponseDto getUser(Long id);
    List<UserResponseDto> getAllUsers();
    UserResponseDto register(RegisterRequestDto request);
}

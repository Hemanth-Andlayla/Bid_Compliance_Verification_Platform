package com.bidcomplaince.bidcompliance.controller;

import com.bidcomplaince.bidcompliance.dto.user.RegisterRequestDto;
import com.bidcomplaince.bidcompliance.dto.user.UserResponseDto;
import com.bidcomplaince.bidcompliance.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> register(
            @Valid @RequestBody RegisterRequestDto request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        userService.register(request)
                );
    }
}
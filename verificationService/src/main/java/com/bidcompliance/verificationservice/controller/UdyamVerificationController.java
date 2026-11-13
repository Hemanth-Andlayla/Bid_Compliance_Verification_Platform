package com.bidcompliance.verificationservice.controller;

import com.bidcompliance.verificationservice.dto.UdyamVerificationRequestDto;
import com.bidcompliance.verificationservice.dto.VerificationResponseDto;
import com.bidcompliance.verificationservice.service.UdyamVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/verify/udyam")
@RequiredArgsConstructor
public class UdyamVerificationController {

    private final UdyamVerificationService udyamVerificationService;

    @PostMapping
    public ResponseEntity<VerificationResponseDto> verify(
            @RequestBody UdyamVerificationRequestDto request) {

        return ResponseEntity.ok(
                udyamVerificationService.verify(request)
        );
    }
}
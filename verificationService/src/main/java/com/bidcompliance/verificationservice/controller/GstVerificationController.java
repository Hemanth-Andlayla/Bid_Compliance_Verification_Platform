package com.bidcompliance.verificationservice.controller;

import com.bidcompliance.verificationservice.dto.GstVerificationRequestDto;
import com.bidcompliance.verificationservice.dto.VerificationResponseDto;
import com.bidcompliance.verificationservice.service.GstVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/verify/gst")
@RequiredArgsConstructor
public class GstVerificationController {

    private final GstVerificationService gstVerificationService;

    @PostMapping
    public ResponseEntity<VerificationResponseDto> verify(
            @RequestBody GstVerificationRequestDto request) {

        return ResponseEntity.ok(
                gstVerificationService.verify(request)
        );
    }
}
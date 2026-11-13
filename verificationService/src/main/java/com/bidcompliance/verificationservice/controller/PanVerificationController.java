package com.bidcompliance.verificationservice.controller;



import com.bidcompliance.verificationservice.dto.PanVerificationRequestDto;
import com.bidcompliance.verificationservice.dto.VerificationResponseDto;
import com.bidcompliance.verificationservice.service.PanVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/verify/pan")
@RequiredArgsConstructor
public class PanVerificationController {

    private final PanVerificationService panVerificationService;


    @PostMapping
    public ResponseEntity<VerificationResponseDto> verify(
            @RequestBody PanVerificationRequestDto request) {

        return ResponseEntity.ok(
                panVerificationService.verify(request)
        );
    }
}
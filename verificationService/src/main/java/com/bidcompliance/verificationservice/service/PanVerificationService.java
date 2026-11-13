package com.bidcompliance.verificationservice.service;

import com.bidcompliance.verificationservice.dto.PanVerificationRequestDto;
import com.bidcompliance.verificationservice.dto.VerificationResponseDto;
import com.bidcompliance.verificationservice.entity.PanRecord;
import com.bidcompliance.verificationservice.repository.PanRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class PanVerificationService {

    private final PanRecordRepository panRecordRepository;

    public VerificationResponseDto verify(PanVerificationRequestDto request) {

        if (request.getPan() == null || request.getPan().isBlank()) {
            return new VerificationResponseDto(
                    false,
                    "FAIL",
                    "PAN is missing.",
                    Map.of()
            );
        }

        if (request.getName() == null || request.getName().isBlank()) {
            return new VerificationResponseDto(
                    false,
                    "FAIL",
                    "Name is missing.",
                    Map.of()
            );
        }

        String pan = normalizeIdentifier(request.getPan());

        PanRecord record = panRecordRepository.findByPan(pan).orElse(null);

        if (record == null) {
            return new VerificationResponseDto(
                    false,
                    "FAIL",
                    "PAN not found in verification records.",
                    Map.of()
            );
        }

        String extractedName = normalizeText(request.getName());
        String storedName = normalizeText(record.getName());

        Map<String, Object> verifiedData = Map.of(
                "pan", record.getPan(),
                "name", record.getName()
        );

        if (!extractedName.equals(storedName)) {

            return new VerificationResponseDto(
                    false,
                    "FAIL",
                    "Name does not match the verification record.",
                    verifiedData
            );
        }

        return new VerificationResponseDto(
                true,
                "PASS",
                "PAN and name match the verification records.",
                verifiedData
        );
    }

    private String normalizeIdentifier(String value) {
        return value.trim().toUpperCase();
    }

    private String normalizeText(String value) {
        return value
                .trim()
                .replaceAll("\\s+", " ")
                .toUpperCase();
    }
}
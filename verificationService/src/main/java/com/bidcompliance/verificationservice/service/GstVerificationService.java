package com.bidcompliance.verificationservice.service;

import com.bidcompliance.verificationservice.dto.GstVerificationRequestDto;
import com.bidcompliance.verificationservice.dto.VerificationResponseDto;
import com.bidcompliance.verificationservice.entity.GstRecord;
import com.bidcompliance.verificationservice.repository.GstRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class GstVerificationService {

    private final GstRecordRepository gstRecordRepository;

    public VerificationResponseDto verify(GstVerificationRequestDto request) {

        if (request.getGstin() == null || request.getGstin().isBlank()) {
            return new VerificationResponseDto(
                    false,
                    "FAIL",
                    "GSTIN is missing.",
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

        if (request.getAddress() == null || request.getAddress().isBlank()) {
            return new VerificationResponseDto(
                    false,
                    "FAIL",
                    "Address is missing.",
                    Map.of()
            );
        }

        String gstin = normalizeIdentifier(request.getGstin());

        GstRecord record =
                gstRecordRepository.findByGstin(gstin).orElse(null);

        if (record == null) {
            return new VerificationResponseDto(
                    false,
                    "FAIL",
                    "GSTIN not found in verification records.",
                    Map.of()
            );
        }

        Map<String, Object> verifiedData = Map.of(
                "gstin", record.getGstin(),
                "name", record.getName(),
                "address", record.getAddress()
        );

        String extractedName = normalizeText(request.getName());
        String storedName = normalizeText(record.getName());

        if (!extractedName.equals(storedName)) {
            return new VerificationResponseDto(
                    false,
                    "FAIL",
                    "Name does not match the verification record.",
                    verifiedData
            );
        }

        String extractedAddress = normalizeText(request.getAddress());
        String storedAddress = normalizeText(record.getAddress());

        if (!extractedAddress.equals(storedAddress)) {
            return new VerificationResponseDto(
                    false,
                    "FAIL",
                    "Address does not match the verification record.",
                    verifiedData
            );
        }

        return new VerificationResponseDto(
                true,
                "PASS",
                "GSTIN, name and address match the verification records.",
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
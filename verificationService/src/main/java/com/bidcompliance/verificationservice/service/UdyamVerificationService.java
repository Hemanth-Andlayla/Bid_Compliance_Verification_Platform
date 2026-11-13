package com.bidcompliance.verificationservice.service;

import com.bidcompliance.verificationservice.dto.UdyamVerificationRequestDto;
import com.bidcompliance.verificationservice.dto.VerificationResponseDto;
import com.bidcompliance.verificationservice.entity.UdyamRecord;
import com.bidcompliance.verificationservice.repository.UdyamRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class UdyamVerificationService {

    private final UdyamRecordRepository udyamRecordRepository;

    public VerificationResponseDto verify(
            UdyamVerificationRequestDto request) {

        if (request.getUdyamNumber() == null
                || request.getUdyamNumber().isBlank()) {

            return new VerificationResponseDto(
                    false,
                    "FAIL",
                    "Udyam number is missing.",
                    Map.of()
            );
        }

        if (request.getName() == null
                || request.getName().isBlank()) {

            return new VerificationResponseDto(
                    false,
                    "FAIL",
                    "Name is missing.",
                    Map.of()
            );
        }

        if (request.getAddress() == null
                || request.getAddress().isBlank()) {

            return new VerificationResponseDto(
                    false,
                    "FAIL",
                    "Address is missing.",
                    Map.of()
            );
        }

        String udyamNumber =
                normalizeIdentifier(request.getUdyamNumber());

        UdyamRecord record =
                udyamRecordRepository
                        .findByUdyamNumber(udyamNumber)
                        .orElse(null);

        if (record == null) {
            return new VerificationResponseDto(
                    false,
                    "FAIL",
                    "Udyam number not found in verification records.",
                    Map.of()
            );
        }

        Map<String, Object> verifiedData = Map.of(
                "udyam_number", record.getUdyamNumber(),
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

        String extractedAddress =
                normalizeText(request.getAddress());

        String storedAddress =
                normalizeText(record.getAddress());

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
                "Udyam number, name and address match the verification records.",
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
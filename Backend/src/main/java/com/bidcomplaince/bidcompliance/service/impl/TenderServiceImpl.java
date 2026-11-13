package com.bidcomplaince.bidcompliance.service.impl;

import com.bidcomplaince.bidcompliance.dto.tender.TenderCreateRequestDto;
import com.bidcomplaince.bidcompliance.dto.tender.TenderRequirementRequestDto;
import com.bidcomplaince.bidcompliance.dto.tender.TenderRequirementResponseDto;
import com.bidcomplaince.bidcompliance.dto.tender.TenderResponseDto;
import com.bidcomplaince.bidcompliance.entity.Tender;
import com.bidcomplaince.bidcompliance.entity.TenderRequirement;
import com.bidcomplaince.bidcompliance.entity.User;
import com.bidcomplaince.bidcompliance.exception.ResourceNotFoundException;
import com.bidcomplaince.bidcompliance.repository.TenderRepository;
import com.bidcomplaince.bidcompliance.repository.TenderRequirementRepository;
import com.bidcomplaince.bidcompliance.repository.UserRepository;
import com.bidcomplaince.bidcompliance.service.TenderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TenderServiceImpl implements TenderService {

    private final TenderRepository tenderRepository;
    private final TenderRequirementRepository tenderRequirementRepository;
    private final UserRepository userRepository;

    @Override
    public TenderResponseDto getTenderById(Long id) {
        Tender tender = tenderRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Tender not found with id: " + id));
        return mapToResponseDto(tender);
    }

    @Override
    public List<TenderResponseDto> getAllTenders() {
        return tenderRepository.findAll()
                .stream()
                .map(this::mapToResponseDto)
                .toList();

    }

    @Override
    @Transactional
    public TenderResponseDto createTender(
            TenderCreateRequestDto request,
            Long userId
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id:"+userId));

        Tender tender = new Tender();

        tender.setTitle(request.getTitle());
        tender.setDescription(request.getDescription());
        tender.setSubmissionDeadline(request.getSubmissionDeadline());

        // Taken from authenticated user's profile
        tender.setCreatedBy(user);
        tender.setOrganization(user.getOrganization());

        tender.setStatus("OPEN");
        tender.setCreatedAt(Instant.now());
        tender.setUpdatedAt(Instant.now());

        Tender savedTender = tenderRepository.save(tender);

        // Create all requirements belonging to this tender
        if (request.getRequirements() != null) {

            for (TenderRequirementRequestDto requirementRequest
                    : request.getRequirements()) {

                TenderRequirement requirement = new TenderRequirement();

                requirement.setTender(savedTender);
                requirement.setRequirementType(
                        requirementRequest.getRequirementType()
                );
                requirement.setDescription(
                        requirementRequest.getDescription()
                );
                requirement.setMandatory(
                        requirementRequest.getMandatory()
                );
                requirement.setCreatedAt(Instant.now());

                tenderRequirementRepository.save(requirement);
            }
        }

        return mapToResponseDto(savedTender);
    }

    private TenderResponseDto mapToResponseDto(Tender tender) {

        TenderResponseDto dto = new TenderResponseDto();

        dto.setId(tender.getId());
        dto.setTitle(tender.getTitle());
        dto.setDescription(tender.getDescription());
        dto.setOrganization(tender.getOrganization());
        dto.setSubmissionDeadline(tender.getSubmissionDeadline());
        dto.setStatus(tender.getStatus());
        dto.setCreatedAt(tender.getCreatedAt());
        dto.setUpdatedAt(tender.getUpdatedAt());

        List<TenderRequirementResponseDto> requirements =
                tenderRequirementRepository
                        .findByTenderId(tender.getId())
                        .stream()
                        .map(this::mapRequirementToResponseDto)
                        .toList();

        dto.setRequirements(requirements);

        return dto;
    }

    private TenderRequirementResponseDto mapRequirementToResponseDto(
            TenderRequirement requirement
    ) {

        TenderRequirementResponseDto dto =
                new TenderRequirementResponseDto();

        dto.setId(requirement.getId());
        dto.setRequirementType(
                requirement.getRequirementType()
        );
        dto.setDescription(
                requirement.getDescription()
        );
        dto.setMandatory(
                requirement.getMandatory()
        );

        return dto;
    }

}

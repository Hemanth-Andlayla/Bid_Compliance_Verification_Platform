package com.bidcomplaince.bidcompliance.controller;

import com.bidcomplaince.bidcompliance.dto.tender.TenderCreateRequestDto;
import com.bidcomplaince.bidcompliance.dto.tender.TenderResponseDto;
import com.bidcomplaince.bidcompliance.entity.User;
import com.bidcomplaince.bidcompliance.service.CurrentUserService;
import com.bidcomplaince.bidcompliance.service.TenderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tenders")
@RequiredArgsConstructor
public class TenderController {

    private final TenderService tenderService;
    private final CurrentUserService currentUserService;

    @PostMapping
    @PreAuthorize("hasRole('OFFICER')")
    public ResponseEntity<TenderResponseDto> createTender(
            @Valid @RequestBody TenderCreateRequestDto request
    ) {


        User currentUser =
                currentUserService.getCurrentUser();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(tenderService.createTender(request, currentUser.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TenderResponseDto> getTenderById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                tenderService.getTenderById(id)
        );
    }

    @GetMapping
    public ResponseEntity<List<TenderResponseDto>> getAllTenders() {

        return ResponseEntity.ok(
                tenderService.getAllTenders()
        );
    }
}
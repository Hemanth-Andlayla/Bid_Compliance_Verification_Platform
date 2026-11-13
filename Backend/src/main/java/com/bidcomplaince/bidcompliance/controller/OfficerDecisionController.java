package com.bidcomplaince.bidcompliance.controller;

import com.bidcomplaince.bidcompliance.dto.officer.*;
import com.bidcomplaince.bidcompliance.service.OfficerDecisionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/officer")
@RequiredArgsConstructor
@PreAuthorize("hasRole('OFFICER')")
public class OfficerDecisionController {

    private final OfficerDecisionService
            officerDecisionService;

    @PostMapping("/bids/{bidId}/decision")
    public ResponseEntity<OfficerDecisionResponseDto>
    submitDecision(
            @PathVariable Long bidId,
            @Valid @RequestBody OfficerDecisionRequestDto request) {

        Long officerId = 1L; // temporary

        return ResponseEntity.ok(
                officerDecisionService.submitDecision(
                        bidId,
                        officerId,
                        request
                )
        );
    }

    @GetMapping("/bids/{bidId}/decision")
    public ResponseEntity<OfficerDecisionResponseDto>
    getDecision(@PathVariable Long bidId) {

        return ResponseEntity.ok(
                officerDecisionService
                        .getDecisionByBidId(bidId)
        );
    }
}
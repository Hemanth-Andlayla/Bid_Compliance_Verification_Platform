package com.bidcomplaince.bidcompliance.controller;

import com.bidcomplaince.bidcompliance.dto.ai.AiSummaryResponseDto;
import com.bidcomplaince.bidcompliance.service.AiAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai-summaries")
@RequiredArgsConstructor
public class AiSummaryController {

    private final AiAnalysisService aiAnalysisService;

    @GetMapping("/bid/{bidId}")
    public ResponseEntity<AiSummaryResponseDto> getSummaryByBidId(
            @PathVariable Long bidId) {

        return ResponseEntity.ok(
                aiAnalysisService.getSummaryByBidId(bidId)
        );
    }
}
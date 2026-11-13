package com.bidcomplaince.bidcompliance.controller;

import com.bidcomplaince.bidcompliance.dto.bid.BidResponseDto;
import com.bidcomplaince.bidcompliance.dto.bid.BidSubmissionRequestDto;
import com.bidcomplaince.bidcompliance.entity.User;
import com.bidcomplaince.bidcompliance.service.BidProcessingService;
import com.bidcomplaince.bidcompliance.service.BidService;
import com.bidcomplaince.bidcompliance.service.CurrentUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/bids")
@RequiredArgsConstructor
public class BidController {

    private final BidService bidService;
    private final BidProcessingService bidProcessingService;
    private final CurrentUserService currentUserService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('BIDDER')")
    public ResponseEntity<BidResponseDto> submitBid(
            @Valid @RequestPart("bidData") BidSubmissionRequestDto request,
            @Valid @RequestPart("documentTypes") List<String> documentTypes,
            @Valid @RequestPart("files") List<MultipartFile> files) {



        User currentUser =
                currentUserService.getCurrentUser();

        BidResponseDto response =
                bidService.submitBid(
                        request,
                        currentUser.getId(),
                        documentTypes,
                        files
                );

        // Start document processing after the bid has
        // been successfully saved.
        bidProcessingService.processBid(response.getId());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);

    }



    @GetMapping("/{id}")
    public ResponseEntity<BidResponseDto> getBidById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                bidService.getBidById(id)
        );
    }

    @GetMapping
    public ResponseEntity<List<BidResponseDto>> getAllBids() {

        return ResponseEntity.ok(
                bidService.getAllBids()
        );
    }
}

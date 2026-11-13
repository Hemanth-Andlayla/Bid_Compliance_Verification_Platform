package com.bidcomplaince.bidcompliance.controller;

import com.bidcomplaince.bidcompliance.dto.document.DocumentResponseDto;
import com.bidcomplaince.bidcompliance.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @GetMapping("/{id}")
    public ResponseEntity<DocumentResponseDto> getDocumentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                documentService.getDocumentById(id)
        );
    }

    @GetMapping("/bid/{bidId}")
    public ResponseEntity<List<DocumentResponseDto>> getDocumentsByBidId(
            @PathVariable Long bidId) {

        return ResponseEntity.ok(
                documentService.getDocumentsByBidId(bidId)
        );
    }
}
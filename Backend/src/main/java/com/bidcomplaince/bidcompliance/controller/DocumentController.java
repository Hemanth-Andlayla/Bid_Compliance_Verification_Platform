
        package com.bidcomplaince.bidcompliance.controller;

import com.bidcomplaince.bidcompliance.dto.document.DocumentResponseDto;
import com.bidcomplaince.bidcompliance.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;


    // --------------------------------------------------
    // Get document metadata
    // --------------------------------------------------

    @GetMapping("/{id}")
    public ResponseEntity<DocumentResponseDto>
    getDocumentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                documentService.getDocumentById(id)
        );
    }


    // --------------------------------------------------
    // Get all documents belonging to a bid
    // --------------------------------------------------

    @GetMapping("/bid/{bidId}")
    public ResponseEntity<List<DocumentResponseDto>>
    getDocumentsByBidId(
            @PathVariable Long bidId) {

        return ResponseEntity.ok(
                documentService.getDocumentsByBidId(
                        bidId
                )
        );
    }


    // --------------------------------------------------
    // View uploaded document
    // --------------------------------------------------

    @GetMapping("/{id}/file")
    public ResponseEntity<Resource>
    getDocumentFile(
            @PathVariable Long id) {

        Resource resource =
                documentService.getDocumentFile(id);


        String filename =
                resource.getFilename();


        return ResponseEntity.ok()

                .contentType(
                        MediaType.APPLICATION_OCTET_STREAM
                )

                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" +
                                filename +
                                "\""
                )

                .body(resource);
    }
}

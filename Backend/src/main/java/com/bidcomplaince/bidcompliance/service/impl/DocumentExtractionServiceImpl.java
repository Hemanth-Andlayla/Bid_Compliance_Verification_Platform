package com.bidcomplaince.bidcompliance.service.impl;

import com.bidcomplaince.bidcompliance.entity.Document;
import com.bidcomplaince.bidcompliance.entity.DocumentExtraction;
import com.bidcomplaince.bidcompliance.repository.DocumentExtractionRepository;
import com.bidcomplaince.bidcompliance.repository.DocumentRepository;
import com.bidcomplaince.bidcompliance.service.DocumentExtractionService;
import com.bidcomplaince.bidcompliance.service.DocumentTextExtractionService;
import com.bidcomplaince.bidcompliance.service.GeminiExtractionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DocumentExtractionServiceImpl
        implements DocumentExtractionService {

    private final DocumentExtractionRepository
            documentExtractionRepository;

    private final DocumentRepository
            documentRepository;

    private final DocumentTextExtractionService
            documentTextExtractionService;

    private final GeminiExtractionService
            geminiExtractionService;


    @Override
    public DocumentExtraction getDocumentExtractionById(
            Long id) {

        return documentExtractionRepository
                .findById(id)
                .orElse(null);
    }


    @Override
    public List<DocumentExtraction>
    getAllDocumentExtractions() {

        return documentExtractionRepository.findAll();
    }


    @Override
    public DocumentExtraction saveDocumentExtraction(
            DocumentExtraction extraction) {

        return documentExtractionRepository.save(
                extraction
        );
    }


    @Override
    @Transactional
    public void extractDocument(Long documentId) {

        // --------------------------------------------------
        // 1. Find document
        // --------------------------------------------------

        Document document =
                documentRepository.findById(documentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Document not found with id: "
                                                + documentId
                                )
                        );


        // --------------------------------------------------
        // 2. Create extraction record
        // --------------------------------------------------

        DocumentExtraction extraction =
                new DocumentExtraction();

        extraction.setDocument(document);
        extraction.setExtractionStatus("PENDING");
        extraction.setExtractedAt(Instant.now());

        extraction =
                documentExtractionRepository.save(
                        extraction
                );


        try {

            // --------------------------------------------------
            // 3. Extract raw text
            // --------------------------------------------------

            String rawText =
                    documentTextExtractionService.extractText(
                            document.getFilePath()
                    );


            if (rawText == null ||
                    rawText.isBlank()) {

                throw new RuntimeException(
                        "No text extracted from document"
                );
            }


            // --------------------------------------------------
            // 4. Send raw text to Gemini
            // --------------------------------------------------

            Map<String, Object> structuredData =
                    geminiExtractionService
                            .extractStructuredData(
                                    document.getDocumentType(),
                                    rawText
                            );


            // --------------------------------------------------
            // 5. Store structured extraction
            // --------------------------------------------------

            extraction.setExtractedFields(
                    structuredData
            );

            extraction.setExtractionStatus(
                    "SUCCESS"
            );

            extraction.setExtractedAt(
                    Instant.now()
            );


            documentExtractionRepository.save(
                    extraction
            );


        } catch (Exception e) {

            // --------------------------------------------------
            // 6. Mark extraction as FAILED
            // --------------------------------------------------

            extraction.setExtractionStatus(
                    "FAILED"
            );

            extraction.setExtractedAt(
                    Instant.now()
            );

            documentExtractionRepository.save(
                    extraction
            );

            throw new RuntimeException(
                    "Document extraction failed for document "
                            + documentId,
                    e
            );
        }
    }


    @Override
    public void extractDocumentsForBid(
            Long bidId) {

        List<Document> documents =
                documentRepository.findByBidId(
                        bidId
                );

        for (Document document : documents) {

            extractDocument(
                    document.getId()
            );
        }
    }
}
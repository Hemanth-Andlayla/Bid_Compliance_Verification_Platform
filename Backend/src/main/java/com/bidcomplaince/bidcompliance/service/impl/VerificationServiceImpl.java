package com.bidcomplaince.bidcompliance.service.impl;

import com.bidcomplaince.bidcompliance.entity.Bid;
import com.bidcomplaince.bidcompliance.entity.Document;
import com.bidcomplaince.bidcompliance.entity.DocumentExtraction;
import com.bidcomplaince.bidcompliance.entity.VerificationResult;
import com.bidcomplaince.bidcompliance.repository.BidRepository;
import com.bidcomplaince.bidcompliance.repository.DocumentExtractionRepository;
import com.bidcomplaince.bidcompliance.repository.DocumentRepository;
import com.bidcomplaince.bidcompliance.repository.VerificationResultRepository;
import com.bidcomplaince.bidcompliance.service.VerificationService;
import com.bidcomplaince.bidcompliance.service.verification.VerificationProvider;
import com.bidcomplaince.bidcompliance.service.verification.VerificationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class VerificationServiceImpl
        implements VerificationService {

    private final BidRepository bidRepository;

    private final DocumentRepository documentRepository;

    private final DocumentExtractionRepository
            documentExtractionRepository;

    private final VerificationResultRepository
            verificationResultRepository;

    private final List<VerificationProvider>
            verificationProviders;


    @Override
    public VerificationResult getVerificationResultById(
            Long id) {

        return verificationResultRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Verification result not found with id: "
                                        + id
                        )
                );
    }


    @Override
    @Transactional
    public void verifyBid(Long bidId) {

        /*
         * ---------------------------------------------------------
         * 1. Find bid
         * ---------------------------------------------------------
         */

        Bid bid =
                bidRepository.findById(bidId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Bid not found with id: "
                                                + bidId
                                )
                        );


        /*
         * ---------------------------------------------------------
         * 2. Get all documents belonging to the bid
         * ---------------------------------------------------------
         */

        List<Document> documents =
                documentRepository.findByBidId(bidId);


        /*
         * ---------------------------------------------------------
         * 3. Verify each document
         * ---------------------------------------------------------
         */

        for (Document document : documents) {

            verifyDocument(
                    bid,
                    document
            );
        }
    }


    private void verifyDocument(
            Bid bid,
            Document document) {

        /*
         * ---------------------------------------------------------
         * 1. Find latest extraction
         * ---------------------------------------------------------
         */

        DocumentExtraction extraction =
                documentExtractionRepository
                        .findTopByDocumentIdOrderByExtractedAtDesc(
                                document.getId()
                        )
                        .orElse(null);


        /*
         * ---------------------------------------------------------
         * 2. Cannot verify without successful extraction
         * ---------------------------------------------------------
         */

        if (extraction == null) {

            saveVerificationResult(
                    bid,
                    document,
                    "NO_EXTRACTION",
                    "REVIEW",
                    Map.of(),
                    "No document extraction result was found."
            );

            return;
        }


        if (!"SUCCESS".equalsIgnoreCase(
                extraction.getExtractionStatus())) {

            saveVerificationResult(
                    bid,
                    document,
                    "NO_EXTRACTION",
                    "REVIEW",
                    Map.of(),
                    "Document extraction was not successful."
            );

            return;
        }


        /*
         * ---------------------------------------------------------
         * 3. Get Gemini's nested fields
         *
         * {
         *   "document_type": "GST",
         *   "fields": {
         *      ...
         *   }
         * }
         * ---------------------------------------------------------
         */

        Map<String, Object> extractedData =
                extraction.getExtractedFields();

        Map<String, Object> fields =
                getExtractedFields(extractedData);


        /*
         * ---------------------------------------------------------
         * 4. Find correct adapter
         * ---------------------------------------------------------
         */

        VerificationProvider provider =
                verificationProviders.stream()
                        .filter(p ->
                                p.supports(
                                        document.getDocumentType()
                                )
                        )
                        .findFirst()
                        .orElse(null);


        /*
         * ---------------------------------------------------------
         * 5. Unsupported document type
         * ---------------------------------------------------------
         */

        if (provider == null) {

            saveVerificationResult(
                    bid,
                    document,
                    "NO_PROVIDER",
                    "REVIEW",
                    Map.of(),
                    "No verification provider is configured for document type: "
                            + document.getDocumentType()
            );

            return;
        }


        /*
         * ---------------------------------------------------------
         * 6. Call adapter
         * ---------------------------------------------------------
         */

        VerificationResponse response;

        try {

            response = provider.verify(fields);

        } catch (Exception e) {

            saveVerificationResult(
                    bid,
                    document,
                    provider.getClass().getSimpleName(),
                    "ERROR",
                    Map.of(),
                    "Verification service could not be reached: "
                            + e.getMessage()
            );

            return;
        }

        /*
         * ---------------------------------------------------------
         * 7. Save result
         * ---------------------------------------------------------
         */

        saveVerificationResult(
                bid,
                document,
                provider.getClass().getSimpleName(),
                response.status(),
                response.verifiedData(),
                response.reason()
        );
    }


    private Map<String, Object> getExtractedFields(
            Map<String, Object> extractedData) {

        if (extractedData == null) {
            return Map.of();
        }

        Object fieldsObject =
                extractedData.get("fields");

        if (!(fieldsObject instanceof Map<?, ?>)) {
            return Map.of();
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> fields =
                (Map<String, Object>) fieldsObject;

        return fields;
    }


    private void saveVerificationResult(
            Bid bid,
            Document document,
            String verificationSource,
            String status,
            Map<String, Object> verifiedData,
            String reason) {

        VerificationResult result =
                new VerificationResult();

        result.setBid(bid);

        result.setDocument(document);

        result.setVerificationSource(
                verificationSource
        );

        result.setStatus(status);

        result.setVerifiedData(
                verifiedData
        );

        result.setReason(reason);

        result.setVerifiedAt(
                Instant.now()
        );

        verificationResultRepository.save(result);
    }
}
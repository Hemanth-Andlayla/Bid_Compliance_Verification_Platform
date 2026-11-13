package com.bidcomplaince.bidcompliance.service.impl;

import com.bidcomplaince.bidcompliance.entity.Bid;
import com.bidcomplaince.bidcompliance.entity.BidderDetails;
import com.bidcomplaince.bidcompliance.entity.CrossVerificationCheck;
import com.bidcomplaince.bidcompliance.entity.CrossVerificationResult;
import com.bidcomplaince.bidcompliance.entity.Document;
import com.bidcomplaince.bidcompliance.entity.DocumentExtraction;
import com.bidcomplaince.bidcompliance.repository.*;
import com.bidcomplaince.bidcompliance.service.CrossVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CrossVerificationServiceImpl
        implements CrossVerificationService {

    private final BidRepository bidRepository;
    private final BidderDetailRepository bidderDetailsRepository;
    private final DocumentRepository documentRepository;
    private final DocumentExtractionRepository documentExtractionRepository;

    private final CrossVerificationResultRepository
            crossVerificationResultRepository;

    private final CrossVerificationCheckRepository
            crossVerificationCheckRepository;


    @Override
    public CrossVerificationResult getCrossVerificationResultById(
            Long id) {

        return crossVerificationResultRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Cross verification result not found with id: "
                                        + id
                        )
                );
    }


    @Override
    public CrossVerificationResult getResultByBidId(
            Long bidId) {

        return crossVerificationResultRepository
                .findByBidId(bidId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Cross verification result not found for bid: "
                                        + bidId
                        )
                );
    }


    @Override
    public CrossVerificationResult saveCrossVerificationResult(
            CrossVerificationResult result) {

        return crossVerificationResultRepository.save(result);
    }


    @Override
    @Transactional
    public void performCrossVerification(Long bidId) {

        /*
         * ---------------------------------------------------------
         * 1. Load bid
         * ---------------------------------------------------------
         */

        Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Bid not found with id: " + bidId
                        )
                );


        /*
         * ---------------------------------------------------------
         * 2. Load bidder details
         * ---------------------------------------------------------
         */

        Optional<BidderDetails> bidderDetailsOptional =
                bidderDetailsRepository.findByBidId(bidId);

        BidderDetails bidderDetails =
                bidderDetailsOptional.orElse(null);


        /*
         * ---------------------------------------------------------
         * 3. Load documents
         * ---------------------------------------------------------
         */

        List<Document> documents =
                documentRepository.findByBidId(bidId);


        /*
         * ---------------------------------------------------------
         * 4. Create / reuse CrossVerificationResult
         * ---------------------------------------------------------
         */

        CrossVerificationResult result =
                crossVerificationResultRepository
                        .findByBidId(bidId)
                        .orElseGet(CrossVerificationResult::new);

        result.setBid(bid);
        result.setCheckedAt(Instant.now());

        /*
         * We initially assume PASS.
         *
         * If any check becomes FAIL:
         *     overall status = FAIL
         *
         * Otherwise if any check becomes REVIEW:
         *     overall status = REVIEW
         *
         * Otherwise:
         *     PASS
         */

        String overallStatus = "PASS";

        List<String> overallReasons =
                new ArrayList<>();


        /*
         * ---------------------------------------------------------
         * 5. Bidder Details ↔ Documents
         * ---------------------------------------------------------
         */

        if (bidderDetails != null) {

            for (Document document : documents) {

                Optional<DocumentExtraction> extractionOptional =
                        documentExtractionRepository
                                .findTopByDocumentIdOrderByExtractedAtDesc(
                                        document.getId()
                                );

                if (extractionOptional.isEmpty()) {

                    overallStatus =
                            updateOverallStatus(
                                    overallStatus,
                                    "REVIEW"
                            );

                    overallReasons.add(
                            "No extraction result found for document: "
                                    + document.getFileName()
                    );

                    continue;
                }

                DocumentExtraction extraction =
                        extractionOptional.get();

                /*
                 * Only successful extraction results
                 * should be used for comparison.
                 */

                if (!"SUCCESS".equalsIgnoreCase(
                        extraction.getExtractionStatus())) {

                    overallStatus =
                            updateOverallStatus(
                                    overallStatus,
                                    "REVIEW"
                            );

                    overallReasons.add(
                            "Document extraction was not successful for: "
                                    + document.getFileName()
                    );

                    continue;
                }


                /*
                 * Gemini response:
                 *
                 * {
                 *   "document_type": "GST",
                 *   "fields": {
                 *      "name": "...",
                 *      "gstin": "...",
                 *      "address": "..."
                 *   }
                 * }
                 */

                Map<String, Object> fields =
                        getExtractedFields(extraction);


                /*
                 * Compare:
                 *
                 * bidder name ↔ document name
                 */

                CheckOutcome nameOutcome =
                        compareValues(
                                "name",
                                bidderDetails.getName(),
                                getField(fields, "name")
                        );

                if (nameOutcome != null) {

                    createCheck(
                            result,
                            "BIDDER_TO_DOCUMENT",
                            "BIDDER_DETAILS",
                            "bidder:" + bidId,
                            "DOCUMENT",
                            "document:" + document.getId(),
                            bidderDetails.getName(),
                            getField(fields, "name"),
                            nameOutcome
                    );

                    overallStatus =
                            updateOverallStatus(
                                    overallStatus,
                                    nameOutcome.status()
                            );

                    overallReasons.add(
                            nameOutcome.reason()
                    );
                }


                /*
                 * PAN
                 */

                CheckOutcome panOutcome =
                        compareIdentifier(
                                "pan",
                                bidderDetails.getPan(),
                                getField(fields, "pan")
                        );

                if (panOutcome != null) {

                    createCheck(
                            result,
                            "BIDDER_TO_DOCUMENT",
                            "BIDDER_DETAILS",
                            "bidder:" + bidId,
                            "DOCUMENT",
                            "document:" + document.getId(),
                            bidderDetails.getPan(),
                            getField(fields, "pan"),
                            panOutcome
                    );

                    overallStatus =
                            updateOverallStatus(
                                    overallStatus,
                                    panOutcome.status()
                            );

                    overallReasons.add(
                            panOutcome.reason()
                    );
                }


                /*
                 * GSTIN
                 */

                CheckOutcome gstinOutcome =
                        compareIdentifier(
                                "gstin",
                                bidderDetails.getGstin(),
                                getField(fields, "gstin")
                        );

                if (gstinOutcome != null) {

                    createCheck(
                            result,
                            "BIDDER_TO_DOCUMENT",
                            "BIDDER_DETAILS",
                            "bidder:" + bidId,
                            "DOCUMENT",
                            "document:" + document.getId(),
                            bidderDetails.getGstin(),
                            getField(fields, "gstin"),
                            gstinOutcome
                    );

                    overallStatus =
                            updateOverallStatus(
                                    overallStatus,
                                    gstinOutcome.status()
                            );

                    overallReasons.add(
                            gstinOutcome.reason()
                    );
                }


                /*
                 * UDYAM NUMBER
                 */

                CheckOutcome udyamOutcome =
                        compareIdentifier(
                                "udyam_number",
                                bidderDetails.getUdyamNumber(),
                                getField(
                                        fields,
                                        "udyam_number"
                                )
                        );

                if (udyamOutcome != null) {

                    createCheck(
                            result,
                            "BIDDER_TO_DOCUMENT",
                            "BIDDER_DETAILS",
                            "bidder:" + bidId,
                            "DOCUMENT",
                            "document:" + document.getId(),
                            bidderDetails.getUdyamNumber(),
                            getField(
                                    fields,
                                    "udyam_number"
                            ),
                            udyamOutcome
                    );

                    overallStatus =
                            updateOverallStatus(
                                    overallStatus,
                                    udyamOutcome.status()
                            );

                    overallReasons.add(
                            udyamOutcome.reason()
                    );
                }


                /*
                 * ADDRESS
                 */

                CheckOutcome addressOutcome =
                        compareValues(
                                "address",
                                bidderDetails.getAddress(),
                                getField(
                                        fields,
                                        "address"
                                )
                        );

                if (addressOutcome != null) {

                    createCheck(
                            result,
                            "BIDDER_TO_DOCUMENT",
                            "BIDDER_DETAILS",
                            "bidder:" + bidId,
                            "DOCUMENT",
                            "document:" + document.getId(),
                            bidderDetails.getAddress(),
                            getField(
                                    fields,
                                    "address"
                            ),
                            addressOutcome
                    );

                    overallStatus =
                            updateOverallStatus(
                                    overallStatus,
                                    addressOutcome.status()
                            );

                    overallReasons.add(
                            addressOutcome.reason()
                    );
                }
            }
        }


        /*
         * ---------------------------------------------------------
         * 6. Document ↔ Document
         * ---------------------------------------------------------
         */

        List<ExtractedDocumentData> extractedDocuments =
                new ArrayList<>();

        for (Document document : documents) {

            Optional<DocumentExtraction> extractionOptional =
                    documentExtractionRepository
                            .findTopByDocumentIdOrderByExtractedAtDesc(
                                    document.getId()
                            );

            if (extractionOptional.isEmpty()) {
                continue;
            }

            DocumentExtraction extraction =
                    extractionOptional.get();

            if (!"SUCCESS".equalsIgnoreCase(
                    extraction.getExtractionStatus())) {
                continue;
            }

            Map<String, Object> fields =
                    getExtractedFields(extraction);

            extractedDocuments.add(
                    new ExtractedDocumentData(
                            document,
                            fields
                    )
            );
        }


        /*
         * Compare every document with every other document.
         *
         * Example:
         *
         * PAN ↔ GST
         * PAN ↔ UDYAM
         * GST ↔ UDYAM
         */

        for (int i = 0;
             i < extractedDocuments.size();
             i++) {

            for (int j = i + 1;
                 j < extractedDocuments.size();
                 j++) {

                ExtractedDocumentData first =
                        extractedDocuments.get(i);

                ExtractedDocumentData second =
                        extractedDocuments.get(j);


                /*
                 * NAME
                 */

                CheckOutcome nameOutcome =
                        compareValues(
                                "name",
                                getField(
                                        first.fields(),
                                        "name"
                                ),
                                getField(
                                        second.fields(),
                                        "name"
                                )
                        );

                if (nameOutcome != null) {

                    createCheck(
                            result,
                            "DOCUMENT_TO_DOCUMENT",
                            "DOCUMENT",
                            "document:" +
                                    first.document().getId(),
                            "DOCUMENT",
                            "document:" +
                                    second.document().getId(),
                            getField(
                                    first.fields(),
                                    "name"
                            ),
                            getField(
                                    second.fields(),
                                    "name"
                            ),
                            nameOutcome
                    );

                    overallStatus =
                            updateOverallStatus(
                                    overallStatus,
                                    nameOutcome.status()
                            );

                    overallReasons.add(
                            nameOutcome.reason()
                    );
                }


                /*
                 * PAN
                 */

                CheckOutcome panOutcome =
                        compareIdentifier(
                                "pan",
                                getField(
                                        first.fields(),
                                        "pan"
                                ),
                                getField(
                                        second.fields(),
                                        "pan"
                                )
                        );

                if (panOutcome != null) {

                    createCheck(
                            result,
                            "DOCUMENT_TO_DOCUMENT",
                            "DOCUMENT",
                            "document:" +
                                    first.document().getId(),
                            "DOCUMENT",
                            "document:" +
                                    second.document().getId(),
                            getField(
                                    first.fields(),
                                    "pan"
                            ),
                            getField(
                                    second.fields(),
                                    "pan"
                            ),
                            panOutcome
                    );

                    overallStatus =
                            updateOverallStatus(
                                    overallStatus,
                                    panOutcome.status()
                            );

                    overallReasons.add(
                            panOutcome.reason()
                    );
                }


                /*
                 * GSTIN
                 */

                CheckOutcome gstinOutcome =
                        compareIdentifier(
                                "gstin",
                                getField(
                                        first.fields(),
                                        "gstin"
                                ),
                                getField(
                                        second.fields(),
                                        "gstin"
                                )
                        );

                if (gstinOutcome != null) {

                    createCheck(
                            result,
                            "DOCUMENT_TO_DOCUMENT",
                            "DOCUMENT",
                            "document:" +
                                    first.document().getId(),
                            "DOCUMENT",
                            "document:" +
                                    second.document().getId(),
                            getField(
                                    first.fields(),
                                    "gstin"
                            ),
                            getField(
                                    second.fields(),
                                    "gstin"
                            ),
                            gstinOutcome
                    );

                    overallStatus =
                            updateOverallStatus(
                                    overallStatus,
                                    gstinOutcome.status()
                            );

                    overallReasons.add(
                            gstinOutcome.reason()
                    );
                }


                /*
                 * UDYAM NUMBER
                 */

                CheckOutcome udyamOutcome =
                        compareIdentifier(
                                "udyam_number",
                                getField(
                                        first.fields(),
                                        "udyam_number"
                                ),
                                getField(
                                        second.fields(),
                                        "udyam_number"
                                )
                        );

                if (udyamOutcome != null) {

                    createCheck(
                            result,
                            "DOCUMENT_TO_DOCUMENT",
                            "DOCUMENT",
                            "document:" +
                                    first.document().getId(),
                            "DOCUMENT",
                            "document:" +
                                    second.document().getId(),
                            getField(
                                    first.fields(),
                                    "udyam_number"
                            ),
                            getField(
                                    second.fields(),
                                    "udyam_number"
                            ),
                            udyamOutcome
                    );

                    overallStatus =
                            updateOverallStatus(
                                    overallStatus,
                                    udyamOutcome.status()
                            );

                    overallReasons.add(
                            udyamOutcome.reason()
                    );
                }


                /*
                 * ADDRESS
                 */

                CheckOutcome addressOutcome =
                        compareValues(
                                "address",
                                getField(
                                        first.fields(),
                                        "address"
                                ),
                                getField(
                                        second.fields(),
                                        "address"
                                )
                        );

                if (addressOutcome != null) {

                    createCheck(
                            result,
                            "DOCUMENT_TO_DOCUMENT",
                            "DOCUMENT",
                            "document:" +
                                    first.document().getId(),
                            "DOCUMENT",
                            "document:" +
                                    second.document().getId(),
                            getField(
                                    first.fields(),
                                    "address"
                            ),
                            getField(
                                    second.fields(),
                                    "address"
                            ),
                            addressOutcome
                    );

                    overallStatus =
                            updateOverallStatus(
                                    overallStatus,
                                    addressOutcome.status()
                            );

                    overallReasons.add(
                            addressOutcome.reason()
                    );
                }
            }
        }


        /*
         * ---------------------------------------------------------
         * 7. Save overall result
         * ---------------------------------------------------------
         */

        result.setStatus(overallStatus);

        if (overallReasons.isEmpty()) {

            result.setOverallReason(
                    "All available cross-verification checks passed."
            );

        } else {

            result.setOverallReason(
                    String.join(
                            " | ",
                            overallReasons
                    )
            );
        }

        result.setCheckedAt(Instant.now());

        crossVerificationResultRepository.save(result);
    }


    /*
     * ============================================================
     * Helper methods
     * ============================================================
     */


    /**
     * Extracts the nested "fields" object from Gemini response.
     *
     * Gemini response:
     *
     * {
     *   "document_type": "GST",
     *   "fields": {
     *       "name": "...",
     *       "gstin": "...",
     *       "address": "..."
     *   }
     * }
     */
    private Map<String, Object> getExtractedFields(
            DocumentExtraction extraction) {

        Map<String, Object> extractedData =
                extraction.getExtractedFields();

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


    /**
     * Gets a field value from the extracted fields.
     */
    private String getField(
            Map<String, Object> fields,
            String fieldName) {

        if (fields == null) {
            return null;
        }

        Object value =
                fields.get(fieldName);

        if (value == null) {
            return null;
        }

        String stringValue =
                String.valueOf(value).trim();

        return stringValue.isBlank()
                ? null
                : stringValue;
    }


    /**
     * Compare normal fields such as:
     *
     * name
     * address
     *
     * Exact match:
     * PASS
     *
     * Different:
     * REVIEW
     *
     * Missing:
     * REVIEW
     */
    private CheckOutcome compareValues(
            String fieldName,
            String value1,
            String value2) {

        if (isBlank(value1) && isBlank(value2)) {
            return null;
        }

        if (isBlank(value1)) {

            return new CheckOutcome(
                    "REVIEW",
                    fieldName +
                            " is missing from the first source."
            );
        }

        if (isBlank(value2)) {

            return new CheckOutcome(
                    "REVIEW",
                    fieldName +
                            " is missing from the second source."
            );
        }

        if (normalize(value1)
                .equals(normalize(value2))) {

            return new CheckOutcome(
                    "PASS",
                    fieldName +
                            " matches between the two sources."
            );
        }

        return new CheckOutcome(
                "REVIEW",
                fieldName +
                        " differs between the two sources."
        );
    }


    /**
     * Compare strong identifiers:
     *
     * PAN
     * GSTIN
     * UDYAM number
     *
     * Exact match:
     * PASS
     *
     * Different:
     * FAIL
     *
     * Missing:
     * REVIEW
     */
    private CheckOutcome compareIdentifier(
            String fieldName,
            String value1,
            String value2) {

        if (isBlank(value1) && isBlank(value2)) {
            return null;
        }

        if (isBlank(value1)) {

            return new CheckOutcome(
                    "REVIEW",
                    fieldName +
                            " is missing from the first source."
            );
        }

        if (isBlank(value2)) {

            return new CheckOutcome(
                    "REVIEW",
                    fieldName +
                            " is missing from the second source."
            );
        }

        if (normalize(value1)
                .equals(normalize(value2))) {

            return new CheckOutcome(
                    "PASS",
                    fieldName +
                            " matches between the two sources."
            );
        }

        return new CheckOutcome(
                "FAIL",
                fieldName +
                        " does not match between the two sources."
        );
    }


    /**
     * Creates and saves one individual
     * cross-verification check.
     */
    private void createCheck(
            CrossVerificationResult result,
            String checkType,
            String sourceType,
            String sourceReference,
            String targetType,
            String targetReference,
            String value1,
            String value2,
            CheckOutcome outcome) {

        CrossVerificationCheck check =
                new CrossVerificationCheck();

        check.setCrossVerificationResult(result);

        check.setCheckType(checkType);

        check.setSourceType(sourceType);

        check.setSourceReference(sourceReference);

        check.setTargetType(targetType);

        check.setTargetReference(targetReference);

        check.setValue1(value1);

        check.setValue2(value2);

        check.setStatus(outcome.status());

        check.setReason(outcome.reason());

        crossVerificationCheckRepository.save(check);
    }


    /**
     * Determines the strongest overall status.
     *
     * FAIL > REVIEW > PASS
     */
    private String updateOverallStatus(
            String currentStatus,
            String newStatus) {

        if ("FAIL".equalsIgnoreCase(currentStatus)
                || "FAIL".equalsIgnoreCase(newStatus)) {

            return "FAIL";
        }

        if ("REVIEW".equalsIgnoreCase(currentStatus)
                || "REVIEW".equalsIgnoreCase(newStatus)) {

            return "REVIEW";
        }

        return "PASS";
    }


    /**
     * Normalizes values before comparison.
     */
    private String normalize(String value) {

        if (value == null) {
            return "";
        }

        return value
                .trim()
                .replaceAll("\\s+", " ")
                .toLowerCase();
    }


    private boolean isBlank(String value) {

        return value == null
                || value.isBlank();
    }


    /*
     * ------------------------------------------------------------
     * Internal records
     * ------------------------------------------------------------
     */

    private record CheckOutcome(
            String status,
            String reason
    ) {
    }


    private record ExtractedDocumentData(
            Document document,
            Map<String, Object> fields
    ) {
    }
}
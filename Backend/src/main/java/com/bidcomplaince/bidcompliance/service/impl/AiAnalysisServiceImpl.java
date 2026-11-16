package com.bidcomplaince.bidcompliance.service.impl;
import com.bidcomplaince.bidcompliance.dto.ai.AiGeneratedResult;
import com.bidcomplaince.bidcompliance.dto.ai.AiSummaryResponseDto;
import com.bidcomplaince.bidcompliance.entity.AiSummary;
import com.bidcomplaince.bidcompliance.entity.Bid;
import com.bidcomplaince.bidcompliance.entity.ComplianceResult;
import com.bidcomplaince.bidcompliance.entity.CrossVerificationCheck;
import com.bidcomplaince.bidcompliance.entity.CrossVerificationResult;
import com.bidcomplaince.bidcompliance.entity.Document;
import com.bidcomplaince.bidcompliance.entity.VerificationResult;
import com.bidcomplaince.bidcompliance.repository.*;
import com.bidcomplaince.bidcompliance.service.AiAnalysisService;
import com.bidcomplaince.bidcompliance.service.AuditLogService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.bidcomplaince.bidcompliance.repository.CrossVerificationCheckRepository;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiAnalysisServiceImpl implements AiAnalysisService {

    private final BidRepository bidRepository;
    private final DocumentRepository documentRepository;
    private final DocumentExtractionRepository documentExtractionRepository;
    private final ComplianceResultRepository complianceResultRepository;
    private final CrossVerificationResultRepository crossVerificationResultRepository;
    private final VerificationResultRepository verificationResultRepository;
    private final AiSummaryRepository aiSummaryRepository;
    private final CrossVerificationCheckRepository
            crossVerificationCheckRepository;
    private final AuditLogService auditLogService;

    private final Client geminiClient;
    private final ObjectMapper objectMapper;

    private static final String MODEL = "gemini-3.6-flash";


    @Override
    @Transactional
    public AiSummaryResponseDto analyzeBid(Long bidId) {

        Bid bid =
                bidRepository.findById(bidId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Bid not found with id: "
                                                + bidId
                                ));


        Map<String, Object> analysisData =
                buildAnalysisData(bid);


        String prompt;

        try {

            String json =
                    objectMapper.writeValueAsString(
                            analysisData
                    );

            prompt = buildPrompt(json);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to prepare AI analysis data",
                    e
            );
        }


        GenerateContentResponse response =
                geminiClient.models.generateContent(
                        MODEL,
                        prompt,
                        null
                );


        String aiText =
                response.text();


        AiGeneratedResult generatedResult;

        try {

            generatedResult =
                    objectMapper.readValue(
                            aiText,
                            AiGeneratedResult.class
                    );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Gemini returned an invalid AI summary: "
                            + aiText,
                    e
            );
        }


        /*
         * Create a NEW AI summary.
         *
         * The ai_summaries table allows multiple
         * summaries for the same bid.
         */
        AiSummary summary =
                new AiSummary();

        summary.setBid(bid);

        summary.setSummaryText(
                generatedResult.getSummary()
        );

        summary.setKeyFindings(
                generatedResult.getKeyFindings()
        );

        summary.setRiskLevel(
                generatedResult.getRiskLevel()
        );

        summary.setRecommendation(
                generatedResult.getRecommendation()
        );

        summary.setGeneratedAt(
                Instant.now()
        );


        AiSummary saved =
                aiSummaryRepository.save(
                        summary
                );


        auditLogService.log(
                null,
                "AI_SUMMARY_GENERATED",
                "BID",
                bidId,
                "AI summary generated for bid"
        );


        return toDto(saved);
    }


    @Override
    @Transactional(readOnly = true)
    public AiSummaryResponseDto getSummaryByBidId(
            Long bidId) {

        AiSummary summary =
                aiSummaryRepository
                        .findTopByBidIdOrderByGeneratedAtDesc(
                                bidId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "AI summary not found for bid: "
                                                + bidId
                                ));


        return toDto(summary);
    }


    // --------------------------------------------------
    // Build AI analysis data
    // --------------------------------------------------

    private Map<String, Object> buildAnalysisData(
            Bid bid) {

        Long bidId =
                bid.getId();


        Map<String, Object> data =
                new LinkedHashMap<>();


        data.put(
                "bid",
                buildBidData(bid)
        );


        data.put(
                "documents",
                buildDocumentData(bidId)
        );


        data.put(
                "complianceResults",
                buildComplianceData(bidId)
        );


        crossVerificationResultRepository
                .findByBidId(bidId)
                .ifPresent(result ->
                        data.put(
                                "crossVerification",
                                buildCrossVerificationData(
                                        result
                                )
                        ));


        data.put(
                "verificationResults",
                buildVerificationData(bidId)
        );


        return data;
    }


    // --------------------------------------------------
    // Bid data
    // --------------------------------------------------

    private Map<String, Object> buildBidData(
            Bid bid) {

        Map<String, Object> data =
                new LinkedHashMap<>();


        data.put(
                "bidId",
                bid.getId()
        );


        data.put(
                "quotedPrice",
                bid.getQuotedPrice()
        );


        data.put(
                "status",
                bid.getStatus()
        );


        return data;
    }


    // --------------------------------------------------
    // Document data
    // --------------------------------------------------

    private List<Map<String, Object>>
    buildDocumentData(Long bidId) {

        List<Document> documents =
                documentRepository
                        .findByBidId(bidId);


        List<Map<String, Object>> result =
                new ArrayList<>();


        for (Document document :
                documents) {

            Map<String, Object> data =
                    new LinkedHashMap<>();


            data.put(
                    "documentId",
                    document.getId()
            );


            data.put(
                    "documentType",
                    document.getDocumentType()
            );


            data.put(
                    "fileName",
                    document.getFileName()
            );


            documentExtractionRepository
                    .findTopByDocumentIdOrderByExtractedAtDesc(
                            document.getId()
                    )
                    .ifPresent(extraction ->
                            data.put(
                                    "extraction",
                                    extraction.getExtractedFields()
                            ));


            result.add(data);
        }


        return result;
    }


    // --------------------------------------------------
    // Compliance data
    // --------------------------------------------------

    private List<Map<String, Object>>
    buildComplianceData(Long bidId) {

        List<ComplianceResult> results =
                complianceResultRepository
                        .findByBidId(bidId);


        List<Map<String, Object>> data =
                new ArrayList<>();


        for (ComplianceResult result :
                results) {

            Map<String, Object> item =
                    new LinkedHashMap<>();


            item.put(
                    "status",
                    result.getStatus()
            );


            item.put(
                    "reason",
                    result.getReason()
            );


            item.put(
                    "checkedAt",
                    result.getCheckedAt() != null
                            ? result.getCheckedAt().toString()
                            : null
            );


            if (result.getRequirement() != null) {

                item.put(
                        "requirementType",
                        result
                                .getRequirement()
                                .getRequirementType()
                );

                item.put(
                        "mandatory",
                        result
                                .getRequirement()
                                .getMandatory()
                );
            }


            if (result.getDocument() != null) {

                item.put(
                        "documentType",
                        result
                                .getDocument()
                                .getDocumentType()
                );
            }


            data.add(item);
        }


        return data;
    }


    // --------------------------------------------------
    // Cross-verification data
    // --------------------------------------------------


    private Map<String, Object>
    buildCrossVerificationData(
            CrossVerificationResult result) {

        Map<String, Object> data =
                new LinkedHashMap<>();


        data.put(
                "status",
                result.getStatus()
        );

        data.put(
                "overallReason",
                result.getOverallReason()
        );

        data.put(
                "checkedAt",
                result.getCheckedAt() != null
                        ? result.getCheckedAt().toString()
                        : null
        );

        List<CrossVerificationCheck> checks =
                crossVerificationCheckRepository
                        .findByCrossVerificationResultId(
                                result.getId()
                        );


        List<Map<String, Object>> checkData =
                new ArrayList<>();


        for (CrossVerificationCheck check :
                checks) {

            Map<String, Object> item =
                    new LinkedHashMap<>();


            item.put(
                    "checkType",
                    check.getCheckType()
            );

            item.put(
                    "sourceType",
                    check.getSourceType()
            );

            item.put(
                    "sourceReference",
                    check.getSourceReference()
            );

            item.put(
                    "targetType",
                    check.getTargetType()
            );

            item.put(
                    "targetReference",
                    check.getTargetReference()
            );

            item.put(
                    "value1",
                    check.getValue1()
            );

            item.put(
                    "value2",
                    check.getValue2()
            );

            item.put(
                    "status",
                    check.getStatus()
            );

            item.put(
                    "reason",
                    check.getReason()
            );


            checkData.add(item);
        }


        data.put(
                "checks",
                checkData
        );


        return data;
    }

    // --------------------------------------------------
    // Verification data
    // --------------------------------------------------

    private List<Map<String, Object>>
    buildVerificationData(Long bidId) {

        List<VerificationResult> results =
                verificationResultRepository
                        .findByBidId(bidId);


        List<Map<String, Object>> data =
                new ArrayList<>();


        for (VerificationResult result :
                results) {

            Map<String, Object> item =
                    new LinkedHashMap<>();


            item.put(
                    "status",
                    result.getStatus()
            );


            item.put(
                    "verificationSource",
                    result.getVerificationSource()
            );


            item.put(
                    "reason",
                    result.getReason()
            );


            item.put(
                    "verifiedData",
                    result.getVerifiedData()
            );


            item.put(
                    "verifiedAt",
                    result.getVerifiedAt() != null
                            ? result.getVerifiedAt().toString()
                            : null
            );


            if (result.getDocument() != null) {

                item.put(
                        "documentType",
                        result
                                .getDocument()
                                .getDocumentType()
                );
            }


            data.add(item);
        }


        return data;
    }


    // --------------------------------------------------
    // AI prompt
    // --------------------------------------------------

    private String buildPrompt(
            String data) {

        return """
                You are an AI decision-support assistant for a
                bid compliance verification platform.

                You are NOT the final decision maker.

                The procurement officer will make the final decision.

                Analyze ONLY the information supplied below.

                Do not invent missing information.

                Do not treat missing data as proof of failure.

                Deterministic verification results such as
                PASS and FAIL must not be changed by you.

                Cross-verification REVIEW means the officer
                should inspect the discrepancy.

                External verification results are authoritative
                only with respect to the result already returned
                by the verification service.

                Your task is to summarize the bid for a
                procurement officer.

                Return ONLY valid JSON.

                Required JSON structure:

                {
                  "summary": "short overall explanation",
                  "keyFindings": [
                    "finding 1",
                    "finding 2"
                  ],
                  "riskLevel": "LOW | MEDIUM | HIGH",
                  "recommendation": "PROCEED | REVIEW | DO_NOT_PROCEED"
                }

                Rules:

                1. LOW:
                   No significant failure or unresolved discrepancy.

                2. MEDIUM:
                   Reviewable discrepancies, ambiguous name/address
                   differences, or incomplete verification.

                3. HIGH:
                   Critical compliance failure, identifier mismatch,
                   failed external verification, or multiple serious
                   failures.

                4. Do not make the officer decision.

                5. Explain the important evidence and failures.

                6. If external verification results are not available,
                   explicitly mention that verification is pending.

                Bid verification data:

                %s
                """.formatted(data);
    }


    // --------------------------------------------------
    // DTO conversion
    // --------------------------------------------------

    private AiSummaryResponseDto toDto(
            AiSummary summary) {

        return new AiSummaryResponseDto(
                summary.getId(),
                summary.getBid().getId(),
                summary.getSummaryText(),
                summary.getKeyFindings(),
                summary.getRiskLevel(),
                summary.getRecommendation(),
                summary.getGeneratedAt()
        );
    }
}

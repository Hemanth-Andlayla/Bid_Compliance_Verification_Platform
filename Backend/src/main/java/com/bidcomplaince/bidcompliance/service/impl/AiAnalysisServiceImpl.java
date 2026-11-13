package com.bidcomplaince.bidcompliance.service.impl;

import com.bidcomplaince.bidcompliance.dto.ai.AiGeneratedResult;
import com.bidcomplaince.bidcompliance.dto.ai.AiSummaryResponseDto;
import com.bidcomplaince.bidcompliance.entity.*;
import com.bidcomplaince.bidcompliance.repository.*;
import com.bidcomplaince.bidcompliance.service.AiAnalysisService;
import com.bidcomplaince.bidcompliance.service.AuditLogService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

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

    private final AuditLogService auditLogService;

    private final Client geminiClient;
    private final ObjectMapper objectMapper;

    private static final String MODEL = "gemini-2.5-flash";

    @Override
    @Transactional
    public AiSummaryResponseDto analyzeBid(Long bidId) {

        Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Bid not found with id: " + bidId
                        ));

        Map<String, Object> analysisData =
                buildAnalysisData(bid);

        String prompt;

        try {
            String json =
                    objectMapper.writeValueAsString(analysisData);

            prompt = buildPrompt(json);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to prepare AI analysis data", e
            );
        }

        GenerateContentResponse response =
                geminiClient.models.generateContent(
                        MODEL,
                        prompt,
                        null
                );

        String aiText = response.text();

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
         * The original ai_summaries table allows multiple
         * summaries for the same bid, so we preserve history.
         */
        AiSummary summary = new AiSummary();

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

        summary.setGeneratedAt(Instant.now());

        AiSummary saved =
                aiSummaryRepository.save(summary);

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
                        .findTopByBidIdOrderByGeneratedAtDesc(bidId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "AI summary not found for bid: "
                                                + bidId
                                ));

        return toDto(summary);
    }

    private Map<String, Object> buildAnalysisData(
            Bid bid) {

        Long bidId = bid.getId();

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
                complianceResultRepository
                        .findByBidId(bidId)
        );

        crossVerificationResultRepository
                .findByBidId(bidId)
                .ifPresent(result ->
                        data.put(
                                "crossVerification",
                                result
                        ));

        List<VerificationResult>
                verificationResults =
                verificationResultRepository
                        .findByBidId(bidId);

        data.put(
                "verificationResults",
                verificationResults
        );

        return data;
    }

    private Map<String, Object> buildBidData(
            Bid bid) {

        Map<String, Object> data =
                new LinkedHashMap<>();

        data.put("bidId", bid.getId());

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

    private List<Map<String, Object>>
    buildDocumentData(Long bidId) {

        List<Document> documents =
                documentRepository
                        .findByBidId(bidId);

        List<Map<String, Object>> result =
                new ArrayList<>();

        for (Document document : documents) {

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

    private String buildPrompt(String data) {

        return """
                You are an AI decision-support assistant for a
                bid compliance verification platform.

                You are NOT the final decision maker.

                The officer will make the final decision.

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

                Your task is to summarize the bid for a government
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
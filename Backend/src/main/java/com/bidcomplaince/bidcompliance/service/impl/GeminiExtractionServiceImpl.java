 package com.bidcomplaince.bidcompliance.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.bidcomplaince.bidcompliance.service.GeminiExtractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiExtractionServiceImpl
        implements GeminiExtractionService {

    private final Client geminiClient;
    private final ObjectMapper objectMapper;

    @Value("${gemini.model}")
    private String model;

    @Override
    public Map<String, Object> extractStructuredData(
            String documentType,
            String rawText) {

        String prompt = buildPrompt(
                documentType,
                rawText
        );

        GenerateContentConfig config =
                GenerateContentConfig.builder()
                        .responseMimeType("application/json")
                        .candidateCount(1)
                        .build();

        GenerateContentResponse response =
                geminiClient.models.generateContent(
                        model,
                        prompt,
                        config
                );

        String json = response.text();

        if (json == null || json.isBlank()) {
            throw new RuntimeException(
                    "Gemini returned empty response"
            );
        }

        try {

            return objectMapper.readValue(
                    json,
                    new TypeReference<Map<String, Object>>() {}
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to parse Gemini JSON response",
                    e
            );
        }
    }

    private String buildPrompt(
            String documentType,
            String rawText) {

        List<String> requiredFields =
                getRequiredFields(documentType);

        String fields = String.join(", ", requiredFields);

        return """
                You are a document information extraction system.

                Document type:
                %s

                Required fields:
                %s

                Extract ONLY the required fields listed above
                from the document text.

                Rules:

                1. Extract only information explicitly present
                   in the document.

                2. Do not invent, guess, or infer information.

                3. If a required field is not present in the
                   document, set its value to null.

                4. Preserve the extracted values accurately.

                5. Do not extract additional fields.

                6. Do not decide whether the document is valid.

                7. Do not decide whether the bidder is compliant.

                8. Do not perform external verification.

                9. Do not make compliance decisions.

                10. Return only valid JSON.

                11. Put all extracted fields inside the
                    "fields" object.

                Required JSON format:

                {
                  "document_type": "%s",
                  "fields": {
                    "field1": "value",
                    "field2": "value"
                  }
                }

                Document text:
                %s
                """.formatted(
                documentType,
                fields,
                documentType,
                rawText
        );
    }

    private List<String> getRequiredFields(
            String documentType) {

        return switch (documentType.toUpperCase()) {

            case "PAN" ->
                    List.of(
                            "name",
                            "pan"
                    );

            case "GST" ->
                    List.of(
                            "name",
                            "gstin",
                            "address"
                    );

            case "UDYAM" ->
                    List.of(
                            "name",
                            "udyam_number",
                            "address"
                    );

            default ->
                    throw new IllegalArgumentException(
                            "Unsupported document type: "
                                    + documentType
                    );
        };
    }
}

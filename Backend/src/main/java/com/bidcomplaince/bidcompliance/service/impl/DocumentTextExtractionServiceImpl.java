package com.bidcomplaince.bidcompliance.service.impl;

import com.bidcomplaince.bidcompliance.dto.extraction.ExtractionResponseDto;
import com.bidcomplaince.bidcompliance.service.DocumentTextExtractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
@RequiredArgsConstructor
public class DocumentTextExtractionServiceImpl
        implements DocumentTextExtractionService {

    private final RestClient restClient;

    @Value("${document.extraction.service.url}")
    private String extractionServiceUrl;

    @Override
    public String extractText(String filePath) {

        ExtractionRequest request =
                new ExtractionRequest(filePath);

        ExtractionResponseDto response =
                restClient
                        .post()
                        .uri(extractionServiceUrl + "/api/extract")
                        .body(request)
                        .retrieve()
                        .body(ExtractionResponseDto.class);

        if (response == null) {
            throw new RuntimeException(
                    "Document extraction service returned no response"
            );
        }

        if (!response.isSuccess()) {
            throw new RuntimeException(
                    "Document text extraction failed"
            );
        }

        if (response.getExtractedText() == null ||
                response.getExtractedText().isBlank()) {

            throw new RuntimeException(
                    "No text could be extracted from document"
            );
        }

        return response.getExtractedText();
    }

    private record ExtractionRequest(
            String file_path
    ) {
    }
}
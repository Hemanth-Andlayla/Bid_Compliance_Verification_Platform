package com.bidcomplaince.bidcompliance.service;

import java.util.Map;

public interface GeminiExtractionService {

    Map<String, Object> extractStructuredData(
            String documentType,
            String rawText
    );
}
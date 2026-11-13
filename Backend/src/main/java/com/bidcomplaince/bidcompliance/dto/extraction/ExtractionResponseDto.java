package com.bidcomplaince.bidcompliance.dto.extraction;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExtractionResponseDto {

    private boolean success;

    @JsonProperty("extracted_text")
    private String extractedText;
}
package com.bidcomplaince.bidcompliance.dto.document;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class DocumentResponseDto {

    private Long id;
    private Long bidId;
    private String documentType;
    private String fileName;
    private Long fileSize;
    private String mimeType;
    private Instant uploadedAt;
}
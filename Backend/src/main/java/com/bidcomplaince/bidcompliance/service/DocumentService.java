package com.bidcomplaince.bidcompliance.service;

import com.bidcomplaince.bidcompliance.dto.document.DocumentResponseDto;
import com.bidcomplaince.bidcompliance.entity.Document;

import java.util.List;

public interface DocumentService {
    DocumentResponseDto getDocumentById(Long id);
    List<DocumentResponseDto> getDocumentsByBidId(Long bidId);
}

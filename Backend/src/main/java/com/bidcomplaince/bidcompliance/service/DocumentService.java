
        package com.bidcomplaince.bidcompliance.service;

import com.bidcomplaince.bidcompliance.dto.document.DocumentResponseDto;

import org.springframework.core.io.Resource;

import java.util.List;

public interface DocumentService {

    DocumentResponseDto getDocumentById(Long id);

    List<DocumentResponseDto> getDocumentsByBidId(Long bidId);

    Resource getDocumentFile(Long id);

}
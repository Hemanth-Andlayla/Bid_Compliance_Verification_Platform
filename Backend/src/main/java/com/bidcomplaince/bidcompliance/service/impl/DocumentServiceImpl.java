package com.bidcomplaince.bidcompliance.service.impl;

import com.bidcomplaince.bidcompliance.dto.document.DocumentResponseDto;
import com.bidcomplaince.bidcompliance.entity.Document;
import com.bidcomplaince.bidcompliance.exception.ResourceNotFoundException;
import com.bidcomplaince.bidcompliance.repository.DocumentRepository;
import com.bidcomplaince.bidcompliance.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;


    @Override
    public DocumentResponseDto getDocumentById(Long id) {

        Document document = documentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Document not found"));

        return mapToResponseDto(document);
    }

    @Override
    public List<DocumentResponseDto> getDocumentsByBidId(Long bidId) {

        return documentRepository.findByBidId(bidId)
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    private DocumentResponseDto mapToResponseDto(Document document) {

        DocumentResponseDto dto = new DocumentResponseDto();

        dto.setId(document.getId());
        dto.setBidId(document.getBid().getId());
        dto.setDocumentType(document.getDocumentType());
        dto.setFileName(document.getFileName());
        dto.setFileSize(document.getFileSize());
        dto.setMimeType(document.getMimeType());
        dto.setUploadedAt(document.getUploadedAt());

        return dto;
    }

}

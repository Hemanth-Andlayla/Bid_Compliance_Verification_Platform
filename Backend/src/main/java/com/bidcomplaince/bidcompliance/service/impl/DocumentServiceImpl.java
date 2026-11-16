
        package com.bidcomplaince.bidcompliance.service.impl;

import com.bidcomplaince.bidcompliance.dto.document.DocumentResponseDto;
import com.bidcomplaince.bidcompliance.entity.Document;
import com.bidcomplaince.bidcompliance.exception.ResourceNotFoundException;
import com.bidcomplaince.bidcompliance.repository.DocumentRepository;
import com.bidcomplaince.bidcompliance.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl
        implements DocumentService {

    private final DocumentRepository documentRepository;


    @Override
    public DocumentResponseDto getDocumentById(
            Long id) {

        Document document =
                documentRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Document not found"
                                )
                        );

        return mapToResponseDto(document);
    }


    @Override
    public List<DocumentResponseDto>
    getDocumentsByBidId(Long bidId) {

        return documentRepository
                .findByBidId(bidId)
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }


    // --------------------------------------------------
    // Get uploaded document file
    // --------------------------------------------------

    @Override
    public Resource getDocumentFile(
            Long id) {

        Document document =
                documentRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Document not found"
                                )
                        );


        String filePath =
                document.getFilePath();


        if (
                filePath == null ||
                        filePath.isBlank()
        ) {

            throw new ResourceNotFoundException(
                    "Document file path is not available"
            );

        }


        Path path =
                Paths.get(filePath);


        if (!Files.exists(path)) {

            throw new ResourceNotFoundException(
                    "Uploaded document file not found"
            );

        }


        if (!Files.isRegularFile(path)) {

            throw new ResourceNotFoundException(
                    "Uploaded document is not a valid file"
            );

        }


        Resource resource =
                new FileSystemResource(path);


        if (!resource.exists() ||
                !resource.isReadable()) {

            throw new ResourceNotFoundException(
                    "Uploaded document cannot be read"
            );

        }


        return resource;
    }


    // --------------------------------------------------
    // Map entity → response DTO
    // --------------------------------------------------

    private DocumentResponseDto
    mapToResponseDto(Document document) {

        DocumentResponseDto dto =
                new DocumentResponseDto();


        dto.setId(
                document.getId()
        );

        dto.setBidId(
                document.getBid().getId()
        );

        dto.setDocumentType(
                document.getDocumentType()
        );

        dto.setFileName(
                document.getFileName()
        );

        dto.setFileSize(
                document.getFileSize()
        );

        dto.setMimeType(
                document.getMimeType()
        );

        dto.setUploadedAt(
                document.getUploadedAt()
        );


        return dto;
    }
}
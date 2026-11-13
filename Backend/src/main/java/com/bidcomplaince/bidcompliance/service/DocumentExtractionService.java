package com.bidcomplaince.bidcompliance.service;

import com.bidcomplaince.bidcompliance.entity.DocumentExtraction;

import java.util.List;

public interface DocumentExtractionService {
    DocumentExtraction getDocumentExtractionById(Long id);
    List<DocumentExtraction> getAllDocumentExtractions();
    DocumentExtraction saveDocumentExtraction(DocumentExtraction extraction);
    void extractDocument(Long documentId);
    void extractDocumentsForBid(Long bidId);
}

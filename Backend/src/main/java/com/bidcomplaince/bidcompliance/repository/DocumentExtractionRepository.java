package com.bidcomplaince.bidcompliance.repository;

import com.bidcomplaince.bidcompliance.entity.DocumentExtraction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DocumentExtractionRepository extends JpaRepository<DocumentExtraction,Long> {
    Optional<DocumentExtraction>
    findTopByDocumentIdOrderByExtractedAtDesc(Long documentId);
}

package com.bidcomplaince.bidcompliance.repository;

import com.bidcomplaince.bidcompliance.dto.document.DocumentResponseDto;
import com.bidcomplaince.bidcompliance.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document,Long> {
    List<Document> findByBidId(Long bidId);
}

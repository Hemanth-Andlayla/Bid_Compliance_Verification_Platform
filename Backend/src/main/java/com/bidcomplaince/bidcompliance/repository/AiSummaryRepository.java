package com.bidcomplaince.bidcompliance.repository;

import com.bidcomplaince.bidcompliance.entity.AiSummary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AiSummaryRepository extends JpaRepository<AiSummary,Long> {
    Optional<AiSummary> findTopByBidIdOrderByGeneratedAtDesc(Long bidId);
}

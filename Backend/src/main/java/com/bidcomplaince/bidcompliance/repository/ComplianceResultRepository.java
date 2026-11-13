package com.bidcomplaince.bidcompliance.repository;

import com.bidcomplaince.bidcompliance.entity.ComplianceResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplianceResultRepository extends JpaRepository<ComplianceResult,Long> {
    List<ComplianceResult> findByBidId(Long bidId);
}

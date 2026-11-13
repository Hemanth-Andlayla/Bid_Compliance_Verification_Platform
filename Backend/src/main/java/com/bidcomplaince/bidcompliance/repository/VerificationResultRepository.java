package com.bidcomplaince.bidcompliance.repository;

import com.bidcomplaince.bidcompliance.entity.VerificationResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VerificationResultRepository extends JpaRepository<VerificationResult,Long> {
    List<VerificationResult> findByBidId(Long bidId);
}

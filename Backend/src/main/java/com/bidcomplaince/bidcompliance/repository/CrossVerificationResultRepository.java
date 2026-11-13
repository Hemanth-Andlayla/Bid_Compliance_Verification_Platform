package com.bidcomplaince.bidcompliance.repository;


import com.bidcomplaince.bidcompliance.entity.CrossVerificationResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CrossVerificationResultRepository extends JpaRepository<CrossVerificationResult,Long> {
    Optional<CrossVerificationResult> findByBidId(Long bidId);
}

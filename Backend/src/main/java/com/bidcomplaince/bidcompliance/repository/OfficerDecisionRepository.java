package com.bidcomplaince.bidcompliance.repository;

import com.bidcomplaince.bidcompliance.entity.OfficerDecision;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OfficerDecisionRepository extends JpaRepository<OfficerDecision,Long> {
    Optional<OfficerDecision> findByBidId(Long bidId);
}

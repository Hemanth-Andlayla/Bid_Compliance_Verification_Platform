package com.bidcomplaince.bidcompliance.repository;

import com.bidcomplaince.bidcompliance.entity.CrossVerificationCheck;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CrossVerificationCheckRepository extends JpaRepository<CrossVerificationCheck,Long> {
    List<CrossVerificationCheck>
    findByCrossVerificationResultId(Long crossVerificationResultId);
}

package com.bidcompliance.verificationservice.repository;

import com.bidcompliance.verificationservice.entity.PanRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PanRecordRepository
        extends JpaRepository<PanRecord, Long> {

    Optional<PanRecord> findByPan(String pan);
}

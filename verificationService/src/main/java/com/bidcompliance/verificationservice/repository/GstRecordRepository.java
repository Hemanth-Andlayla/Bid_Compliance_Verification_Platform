package com.bidcompliance.verificationservice.repository;
import com.bidcompliance.verificationservice.entity.GstRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GstRecordRepository
        extends JpaRepository<GstRecord, Long> {

    Optional<GstRecord> findByGstin(String gstin);
}

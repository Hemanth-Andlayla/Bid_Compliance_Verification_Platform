package com.bidcompliance.verificationservice.repository;

import com.bidcompliance.verificationservice.entity.UdyamRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UdyamRecordRepository
        extends JpaRepository<UdyamRecord, Long> {

    Optional<UdyamRecord> findByUdyamNumber(String udyamNumber);
}

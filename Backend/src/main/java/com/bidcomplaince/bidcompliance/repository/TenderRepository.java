package com.bidcomplaince.bidcompliance.repository;

import com.bidcomplaince.bidcompliance.entity.Tender;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenderRepository extends JpaRepository<Tender,Long> {
}

package com.bidcomplaince.bidcompliance.repository;

import com.bidcomplaince.bidcompliance.entity.TenderRequirement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface TenderRequirementRepository extends JpaRepository<TenderRequirement,Long>{
    List<TenderRequirement> findByTenderId(Long id);
}

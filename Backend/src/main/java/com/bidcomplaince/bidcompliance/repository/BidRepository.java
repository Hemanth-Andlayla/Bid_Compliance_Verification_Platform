package com.bidcomplaince.bidcompliance.repository;

import com.bidcomplaince.bidcompliance.entity.Bid;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BidRepository extends JpaRepository<Bid,Long> {
}

package com.bidcomplaince.bidcompliance.repository;


import com.bidcomplaince.bidcompliance.entity.BidderDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BidderDetailRepository extends JpaRepository<BidderDetails,Long> {
    Optional<BidderDetails> findByBidId(Long bidId);
}

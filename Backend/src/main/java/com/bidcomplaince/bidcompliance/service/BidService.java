package com.bidcomplaince.bidcompliance.service;

import com.bidcomplaince.bidcompliance.dto.bid.BidResponseDto;
import com.bidcomplaince.bidcompliance.dto.bid.BidSubmissionRequestDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface BidService {
    BidResponseDto getBidById(Long id);

    List<BidResponseDto> getAllBids();

    BidResponseDto submitBid(
            BidSubmissionRequestDto request,
            Long bidderId,
            List<String> documentTypes,
            List<MultipartFile> files
    );


}

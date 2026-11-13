package com.bidcomplaince.bidcompliance.dto.bid;

import com.bidcomplaince.bidcompliance.dto.document.DocumentResponseDto;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Getter
@Setter
public class BidResponseDto {

    private Long id;
    private Long tenderId;
    private Long bidderId;
    private BigDecimal quotedPrice;
    private String status;
    private Instant submittedAt;
    private Instant updatedAt;
    private List<DocumentResponseDto> documents;
}
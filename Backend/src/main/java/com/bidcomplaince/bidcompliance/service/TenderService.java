package com.bidcomplaince.bidcompliance.service;

import com.bidcomplaince.bidcompliance.dto.tender.TenderCreateRequestDto;
import com.bidcomplaince.bidcompliance.dto.tender.TenderResponseDto;

import java.util.List;

public interface TenderService {
    TenderResponseDto getTenderById(Long id);
    List<TenderResponseDto> getAllTenders();
    TenderResponseDto createTender(TenderCreateRequestDto request, Long userId);
}

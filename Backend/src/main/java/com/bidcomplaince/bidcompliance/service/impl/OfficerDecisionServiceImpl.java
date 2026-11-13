package com.bidcomplaince.bidcompliance.service.impl;

import com.bidcomplaince.bidcompliance.dto.officer.*;
import com.bidcomplaince.bidcompliance.entity.*;
import com.bidcomplaince.bidcompliance.repository.*;
import com.bidcomplaince.bidcompliance.service.AuditLogService;
import com.bidcomplaince.bidcompliance.service.OfficerDecisionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class OfficerDecisionServiceImpl
        implements OfficerDecisionService {

    private final BidRepository bidRepository;
    private final UserRepository userRepository;
    private final OfficerDecisionRepository
            officerDecisionRepository;

    private final AuditLogService auditLogService;

    @Override
    @Transactional
    public OfficerDecisionResponseDto submitDecision(
            Long bidId,
            Long officerId,
            OfficerDecisionRequestDto request) {

        Bid bid =
                bidRepository.findById(bidId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Bid not found with id: "
                                                + bidId
                                ));

        User officer =
                userRepository.findById(officerId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Officer not found with id: "
                                                + officerId
                                ));

        validateDecision(request.getDecision());

        OfficerDecision decision =
                officerDecisionRepository
                        .findByBidId(bidId)
                        .orElseGet(OfficerDecision::new);

        decision.setBid(bid);
        decision.setOfficer(officer);
        decision.setDecision(
                request.getDecision()
        );
        decision.setRemarks(
                request.getRemarks()
        );
        decision.setDecidedAt(
                Instant.now()
        );

        OfficerDecision saved =
                officerDecisionRepository.save(decision);

        /*
         * Update bid status according to the officer's
         * final decision.
         */
        bid.setStatus(
                request.getDecision()
        );

        bidRepository.save(bid);

        auditLogService.log(
                officerId,
                "OFFICER_DECISION",
                "BID",
                bidId,
                "Officer decision: "
                        + request.getDecision()
        );

        return toDto(saved);
    }

    @Override
    public OfficerDecisionResponseDto
    getDecisionByBidId(Long bidId) {

        OfficerDecision decision =
                officerDecisionRepository
                        .findByBidId(bidId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Officer decision not found for bid: "
                                                + bidId
                                ));

        return toDto(decision);
    }

    private void validateDecision(String decision) {

        if (decision == null ||
                (!decision.equals("APPROVE")
                        && !decision.equals("REJECT")
                        && !decision.equals(
                        "REQUEST_CLARIFICATION"))) {

            throw new IllegalArgumentException(
                    "Invalid officer decision"
            );
        }
    }

    private OfficerDecisionResponseDto
    toDto(OfficerDecision decision) {

        return new OfficerDecisionResponseDto(
                decision.getId(),
                decision.getBid().getId(),
                decision.getOfficer().getId(),
                decision.getDecision(),
                decision.getRemarks(),
                decision.getDecidedAt()
        );
    }
}
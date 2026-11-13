package com.bidcomplaince.bidcompliance.service.impl;

import com.bidcomplaince.bidcompliance.entity.Bid;
import com.bidcomplaince.bidcompliance.entity.ComplianceResult;
import com.bidcomplaince.bidcompliance.entity.Document;
import com.bidcomplaince.bidcompliance.entity.TenderRequirement;
import com.bidcomplaince.bidcompliance.repository.BidRepository;
import com.bidcomplaince.bidcompliance.repository.ComplianceResultRepository;
import com.bidcomplaince.bidcompliance.repository.DocumentRepository;
import com.bidcomplaince.bidcompliance.repository.TenderRequirementRepository;
import com.bidcomplaince.bidcompliance.service.ComplianceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplianceServiceImpl
        implements ComplianceService {

    private final ComplianceResultRepository
            complianceResultRepository;

    private final BidRepository
            bidRepository;

    private final TenderRequirementRepository
            tenderRequirementRepository;

    private final DocumentRepository
            documentRepository;


    @Override
    public ComplianceResult getComplianceResultById(
            Long id) {

        return complianceResultRepository
                .findById(id)
                .orElse(null);
    }


    @Override
    public List<ComplianceResult> getResultsByBidId(
            Long bidId) {

        return complianceResultRepository
                .findByBidId(bidId);
    }


    @Override
    public ComplianceResult saveComplianceResult(
            ComplianceResult result) {

        return complianceResultRepository.save(
                result
        );
    }


    @Override
    public void checkCompliance(Long bidId) {

        // --------------------------------------------------
        // 1. Find the bid
        // --------------------------------------------------

        Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Bid not found with id: "
                                        + bidId
                        )
                );


        // --------------------------------------------------
        // 2. Find all requirements of the tender
        // --------------------------------------------------

        List<TenderRequirement> requirements =
                tenderRequirementRepository
                        .findByTenderId(
                                bid.getTender().getId()
                        );


        // --------------------------------------------------
        // 3. Find all documents submitted with the bid
        // --------------------------------------------------

        List<Document> documents =
                documentRepository
                        .findByBidId(bidId);


        // --------------------------------------------------
        // 4. Check every requirement
        // --------------------------------------------------

        for (TenderRequirement requirement :
                requirements) {

            // Find a document matching the
            // requirement type.

            Document matchingDocument =
                    documents.stream()
                            .filter(document ->
                                    document.getDocumentType()
                                            .equalsIgnoreCase(
                                                    requirement
                                                            .getRequirementType()
                                            )
                            )
                            .findFirst()
                            .orElse(null);


            ComplianceResult result =
                    new ComplianceResult();

            result.setBid(bid);
            result.setRequirement(
                    requirement
            );
            result.setCheckedAt(
                    Instant.now()
            );


            // --------------------------------------------------
            // 5. Requirement is satisfied
            // --------------------------------------------------

            if (matchingDocument != null) {

                result.setDocument(
                        matchingDocument
                );

                result.setStatus("PASS");

                result.setReason(
                        "Required document is present."
                );

            }

            // --------------------------------------------------
            // 6. Required document is missing
            // --------------------------------------------------

            else {

                result.setDocument(null);

                if (requirement.getMandatory()) {

                    result.setStatus("FAIL");

                    result.setReason(
                            "Mandatory document is missing."
                    );

                }  else {

                result.setStatus("PASS");

                result.setReason(
                        "Optional document is not provided, but it is not required."
                );
                }
            }


            // --------------------------------------------------
            // 7. Save result
            // --------------------------------------------------

            complianceResultRepository.save(
                    result
            );
        }
    }
}

package com.bidcomplaince.bidcompliance.service.impl;

import com.bidcomplaince.bidcompliance.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;

@Service
@RequiredArgsConstructor
public class BidProcessingServiceImpl
        implements BidProcessingService {

    private final DocumentExtractionService
            documentExtractionService;

    private final ComplianceService
            complianceService;

    private final CrossVerificationService
            crossVerificationService;

    private final VerificationService
            verificationService;
    private final AiAnalysisService aiAnalysisService;

    @Qualifier("bidProcessingExecutor")
    private final Executor bidProcessingExecutor;


    @Override
    public void processBid(Long bidId) {

        try {

            // -------------------------------------------------
            // STEP 1: Extract information from all documents
            // -------------------------------------------------

            documentExtractionService
                    .extractDocumentsForBid(bidId);


            // -------------------------------------------------
            // STEP 2: Run the three independent checks
            //         in parallel
            // -------------------------------------------------

            CompletableFuture<Void> compliance =
                    CompletableFuture.runAsync(
                            () -> complianceService
                                    .checkCompliance(bidId),
                            bidProcessingExecutor
                    );


            CompletableFuture<Void> crossVerification =
                    CompletableFuture.runAsync(
                            () -> crossVerificationService
                                    .performCrossVerification(bidId),
                            bidProcessingExecutor
                    );


            CompletableFuture<Void> externalVerification =
                    CompletableFuture.runAsync(
                            () -> verificationService
                                    .verifyBid(bidId),
                            bidProcessingExecutor
                    );


            // -------------------------------------------------
            // STEP 3: Wait until all three are completed
            // -------------------------------------------------

            CompletableFuture.allOf(
                    compliance,
                    crossVerification,
                    externalVerification
            ).join();


            // -------------------------------------------------
            // STEP 4: AI analysis will be called here
            // -------------------------------------------------

            aiAnalysisService.analyzeBid(bidId);



            System.out.println(
                    "Bid processing completed for bid: "
                            + bidId
            );


        } catch (Exception e) {

            System.err.println(
                    "Bid processing failed for bid: "
                            + bidId
            );

            e.printStackTrace();
        }
    }
}
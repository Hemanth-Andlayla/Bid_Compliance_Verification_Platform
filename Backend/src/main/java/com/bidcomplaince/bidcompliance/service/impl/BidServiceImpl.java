package com.bidcomplaince.bidcompliance.service.impl;

import com.bidcomplaince.bidcompliance.dto.bid.BidResponseDto;
import com.bidcomplaince.bidcompliance.dto.document.DocumentResponseDto;
import com.bidcomplaince.bidcompliance.entity.Bid;
import com.bidcomplaince.bidcompliance.entity.BidderDetails;
import com.bidcomplaince.bidcompliance.entity.Document;
import com.bidcomplaince.bidcompliance.entity.Tender;
import com.bidcomplaince.bidcompliance.entity.User;
import com.bidcomplaince.bidcompliance.repository.BidRepository;
import com.bidcomplaince.bidcompliance.repository.BidderDetailRepository;
import com.bidcomplaince.bidcompliance.repository.DocumentRepository;
import com.bidcomplaince.bidcompliance.repository.TenderRepository;
import com.bidcomplaince.bidcompliance.repository.UserRepository;
import com.bidcomplaince.bidcompliance.service.BidService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BidServiceImpl implements BidService {

    private final BidRepository bidRepository;
    private final BidderDetailRepository bidderDetailsRepository;
    private final TenderRepository tenderRepository;
    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;

    private final Path uploadDirectory =
            Paths.get("uploads/bids");

    @Override
    public BidResponseDto getBidById(Long id) {

        Bid bid = bidRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Bid not found with id: " + id
                        ));

        return mapToResponseDto(bid);
    }

    @Override
    public List<BidResponseDto> getAllBids() {

        return bidRepository.findAll()
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    @Override
    @Transactional
    public BidResponseDto submitBid(
            com.bidcomplaince.bidcompliance.dto.bid.BidSubmissionRequestDto request,
            Long bidderId,
            List<String> documentTypes,
            List<MultipartFile> files) {

        // --------------------------------------------------
        // 1. Validate uploaded documents
        // --------------------------------------------------

        if (documentTypes == null || files == null) {
            throw new RuntimeException(
                    "Document types and files are required"
            );
        }

        if (documentTypes.size() != files.size()) {
            throw new RuntimeException(
                    "Document types and files count must match"
            );
        }

        // --------------------------------------------------
        // 2. Find tender
        // --------------------------------------------------

        Tender tender = tenderRepository.findById(
                request.getTenderId()
        ).orElseThrow(() ->
                new RuntimeException(
                        "Tender not found with id: "
                                + request.getTenderId()
                )
        );

        // --------------------------------------------------
        // 3. Find bidder
        // --------------------------------------------------

        User bidder = userRepository.findById(bidderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Bidder not found with id: "
                                        + bidderId
                        )
                );

        // --------------------------------------------------
        // 4. Create Bid
        // --------------------------------------------------

        Bid bid = new Bid();

        bid.setTender(tender);
        bid.setBidder(bidder);
        bid.setQuotedPrice(request.getQuotedPrice());
        bid.setStatus("SUBMITTED");

        bid.setSubmittedAt(Instant.now());
        bid.setUpdatedAt(Instant.now());

        Bid savedBid = bidRepository.save(bid);

        // --------------------------------------------------
        // 5. Create Bidder Details
        // --------------------------------------------------

        if (request.getBidderDetails() != null) {

            BidderDetails bidderDetails =
                    new BidderDetails();

            bidderDetails.setBid(savedBid);

            bidderDetails.setName(
                    request.getBidderDetails().getName()
            );

            bidderDetails.setPan(
                    request.getBidderDetails().getPan()
            );

            bidderDetails.setGstin(
                    request.getBidderDetails().getGstin()
            );

            bidderDetails.setUdyamNumber(
                    request.getBidderDetails().getUdyamNumber()
            );

            bidderDetails.setAddress(
                    request.getBidderDetails().getAddress()
            );

            bidderDetailsRepository.save(
                    bidderDetails
            );
        }

        // --------------------------------------------------
        // 6. Create unique folder for this BID
        // --------------------------------------------------

        Path bidDirectory = uploadDirectory
                .resolve(String.valueOf(savedBid.getId()));

        try {

            Files.createDirectories(bidDirectory);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Could not create bid upload directory",
                    e
            );
        }

        // --------------------------------------------------
        // 7. Store each document inside the bid folder
        // --------------------------------------------------

        List<DocumentResponseDto> documentResponses =
                new ArrayList<>();

        for (int i = 0; i < files.size(); i++) {

            MultipartFile file = files.get(i);

            String documentType =
                    documentTypes.get(i);

            String filePath =
                    storeFile(
                            file,
                            bidDirectory
                    );

            Document document =
                    new Document();

            document.setBid(savedBid);
            document.setDocumentType(documentType);
            document.setFileName(
                    file.getOriginalFilename()
            );
            document.setFilePath(filePath);
            document.setFileSize(file.getSize());
            document.setMimeType(file.getContentType());
            document.setUploadedAt(Instant.now());

            Document savedDocument =
                    documentRepository.save(document);

            documentResponses.add(
                    mapDocumentToResponseDto(
                            savedDocument
                    )
            );
        }

        // --------------------------------------------------
        // 8. Create Bid response
        // --------------------------------------------------

        BidResponseDto response =
                mapToResponseDto(savedBid);

        response.setDocuments(
                documentResponses
        );

        return response;
    }

    // ======================================================
    // FILE STORAGE
    // ======================================================

    private String storeFile(
            MultipartFile file,
            Path bidDirectory) {

        String originalFileName =
                file.getOriginalFilename();

        if (originalFileName == null ||
                originalFileName.isBlank()) {

            throw new RuntimeException(
                    "Invalid file name"
            );
        }

        /*
         * Generate a unique filename so that two files with
         * the same original name do not overwrite each other.
         */
        String uniqueFileName =
                UUID.randomUUID()
                        + "_" +
                        Paths.get(originalFileName)
                                .getFileName()
                                .toString();

        Path destination =
                bidDirectory.resolve(uniqueFileName);

        try {

            Files.copy(
                    file.getInputStream(),
                    destination,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return destination
                    .toAbsolutePath()
                    .toString();

        } catch (IOException e) {

            throw new RuntimeException(
                    "Could not store file: "
                            + originalFileName,
                    e
            );
        }
    }

    // ======================================================
    // BID → RESPONSE DTO
    // ======================================================

    private BidResponseDto mapToResponseDto(
            Bid bid) {

        BidResponseDto dto =
                new BidResponseDto();

        dto.setId(bid.getId());

        dto.setTenderId(
                bid.getTender().getId()
        );

        dto.setBidderId(
                bid.getBidder().getId()
        );

        dto.setQuotedPrice(
                bid.getQuotedPrice()
        );

        dto.setStatus(
                bid.getStatus()
        );

        dto.setSubmittedAt(
                bid.getSubmittedAt()
        );

        dto.setUpdatedAt(
                bid.getUpdatedAt()
        );

        return dto;
    }

    // ======================================================
    // DOCUMENT → RESPONSE DTO
    // ======================================================

    private DocumentResponseDto mapDocumentToResponseDto(
            Document document) {

        DocumentResponseDto dto =
                new DocumentResponseDto();

        dto.setId(document.getId());

        dto.setBidId(
                document.getBid().getId()
        );

        dto.setDocumentType(
                document.getDocumentType()
        );

        dto.setFileName(
                document.getFileName()
        );

        dto.setFileSize(
                document.getFileSize()
        );

        dto.setMimeType(
                document.getMimeType()
        );

        dto.setUploadedAt(
                document.getUploadedAt()
        );

        return dto;
    }
}
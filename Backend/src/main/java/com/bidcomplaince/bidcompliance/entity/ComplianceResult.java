package com.bidcomplaince.bidcompliance.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "compliance_results")
public class ComplianceResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "bid_id", nullable = false)
    private Bid bid;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "requirement_id", nullable = false)
    private TenderRequirement requirement;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    private Document document;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Lob
    @Column(name = "reason")
    private String reason;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "checked_at", nullable = false)
    private Instant checkedAt;



}
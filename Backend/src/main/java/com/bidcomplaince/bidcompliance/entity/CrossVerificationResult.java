package com.bidcomplaince.bidcompliance.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "cross_verification_results")
public class CrossVerificationResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "bid_id", nullable = false)
    private Bid bid;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Lob
    @Column(name = "overall_reason")
    private String overallReason;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "checked_at", nullable = false)
    private Instant checkedAt;


}
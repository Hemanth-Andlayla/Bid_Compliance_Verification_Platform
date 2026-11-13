package com.bidcomplaince.bidcompliance.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "officer_decisions")
public class OfficerDecision {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "bid_id", nullable = false)
    private Bid bid;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "officer_id", nullable = false)
    private User officer;

    @Column(name = "decision", nullable = false, length = 30)
    private String decision;

    @Lob
    @Column(name = "remarks")
    private String remarks;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "decided_at", nullable = false)
    private Instant decidedAt;


}
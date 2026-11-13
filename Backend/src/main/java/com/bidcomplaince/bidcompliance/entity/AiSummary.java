package com.bidcomplaince.bidcompliance.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "ai_summaries")
@Getter
@Setter
public class AiSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bid_id", nullable = false)
    private Bid bid;

    @Column(
            name = "summary_text",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String summaryText;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(
            name = "key_findings",
            columnDefinition = "json"
    )
    private List<String> keyFindings;

    @Column(name = "risk_level")
    private String riskLevel;

    @Column(
            name = "recommendation",
            columnDefinition = "TEXT"
    )
    private String recommendation;

    @Column(name = "generated_at", nullable = false)
    private Instant generatedAt;
}
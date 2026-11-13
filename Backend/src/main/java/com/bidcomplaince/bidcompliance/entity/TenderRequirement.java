package com.bidcomplaince.bidcompliance.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "tender_requirements")
public class TenderRequirement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tender_id", nullable = false)
    private Tender tender;

    @Column(name = "requirement_type", nullable = false, length = 50)
    private String requirementType;

    @Lob
    @Column(name = "description")
    private String description;

    @ColumnDefault("1")
    @Column(name = "mandatory", nullable = false)
    private Boolean mandatory;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;


}
package com.bidcomplaince.bidcompliance.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Map;

@Getter
@Setter
@Entity
@Table(name = "document_extractions")
public class DocumentExtraction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "extracted_fields")
    private Map<String, Object> extractedFields;

    @Column(name = "extraction_status", nullable = false, length = 30)
    private String extractionStatus;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "extracted_at", nullable = false)
    private Instant extractedAt;


}
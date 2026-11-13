package com.bidcomplaince.bidcompliance.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "cross_verification_checks")
public class CrossVerificationCheck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "cross_verification_result_id", nullable = false)
    private CrossVerificationResult crossVerificationResult;

    @Column(name = "check_type", nullable = false, length = 50)
    private String checkType;

    @Column(name = "source_type", nullable = false, length = 50)
    private String sourceType;

    @Column(name = "source_reference", nullable = false)
    private String sourceReference;

    @Column(name = "target_type", nullable = false, length = 50)
    private String targetType;

    @Column(name = "target_reference", nullable = false)
    private String targetReference;

    @Lob
    @Column(name = "value_1")
    private String value1;

    @Lob
    @Column(name = "value_2")
    private String value2;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Lob
    @Column(name = "reason")
    private String reason;


}
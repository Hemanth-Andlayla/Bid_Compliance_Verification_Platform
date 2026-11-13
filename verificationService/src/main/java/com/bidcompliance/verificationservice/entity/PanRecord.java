package com.bidcompliance.verificationservice.entity;



import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
@Entity
@Table(name = "pan_records")
@Getter
@Setter
public class PanRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 10)
    private String pan;

    @Column(nullable = false)
    private String name;
}

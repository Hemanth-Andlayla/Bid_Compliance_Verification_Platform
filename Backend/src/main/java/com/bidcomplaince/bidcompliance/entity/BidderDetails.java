package com.bidcomplaince.bidcompliance.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "bidder_details")
public class BidderDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "bid_id", nullable = false)
    private Bid bid;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "pan", length = 20)
    private String pan;

    @Column(name = "gstin", length = 20)
    private String gstin;

    @Column(name = "udyam_number", length = 50)
    private String udyamNumber;

    @Lob
    @Column(name = "address")
    private String address;


}
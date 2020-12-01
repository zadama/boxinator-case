package com.example.boxinator.Models;


import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;

@Entity
@JsonIdentityInfo(
        generator =
                ObjectIdGenerators.PropertyGenerator.class,
        property = "id"
)

public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private long weight;

    @Column(nullable = false)
    private long boxColour;

    @Column(nullable = false)
    private long destinationCountry; // Relation to country to get fee multiplier

    @Column(nullable = false)
    private long receiver; // store name/id of receiver

    @Column(nullable = false)
    private long sourceCountry;

    @Column(nullable = false)
    private long accountId; // relation to who created shipment

    @Column(nullable = false)
    private String shipmentStatus;
}

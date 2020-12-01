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
    private Long weight;

    @Column(nullable = false)
    private String boxColour;

    @Column(nullable = false)
    private String destinationCountry; // Relation to country to get fee multiplier

    @Column(nullable = false)
    private String receiver; // store name/id of receiver

    @Column(nullable = false)
    private String sourceCountry;

    @Column(nullable = false)
    private Long accountId; // relation to who created shipment

    @Column(nullable = false)
    private String shipmentStatus;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getWeight() {
        return weight;
    }

    public void setWeight(Long weight) {
        this.weight = weight;
    }

    public String getBoxColour() {
        return boxColour;
    }

    public void setBoxColour(String boxColour) {
        this.boxColour = boxColour;
    }

    public String getDestinationCountry() {
        return destinationCountry;
    }

    public void setDestinationCountry(String destinationCountry) {
        this.destinationCountry = destinationCountry;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public String getSourceCountry() {
        return sourceCountry;
    }

    public void setSourceCountry(String sourceCountry) {
        this.sourceCountry = sourceCountry;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public String getShipmentStatus() {
        return shipmentStatus;
    }

    public void setShipmentStatus(String shipmentStatus) {
        this.shipmentStatus = shipmentStatus;
    }

}



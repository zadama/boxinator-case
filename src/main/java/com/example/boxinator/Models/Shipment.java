package com.example.boxinator.Models;


import com.example.boxinator.Models.Enums.ShipmentStatus;
import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;
import java.util.Date;

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
    private Double totalPrice;

    @Column(nullable = false)
    private String boxColour;

    @Column(nullable = false)
    private String receiver; // store name/id of receiver

    @Column(nullable = false)
    private String sourceCountry;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShipmentStatus shipmentStatus;

    @ManyToOne
    private Country destinationCountry;

    @Column
    private Date createdAt;

    @JsonGetter("destinationCountry")
    private String destinationCountry() { return destinationCountry.getName();}

    @JsonGetter("account")
    private String account() {
        return account == null ? "" : account.getFirstName() + " " + account.getLastName();
    }

    @ManyToOne
    private Account account;

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }


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

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getBoxColour() {
        return boxColour;
    }

    public void setBoxColour(String boxColour) {
        this.boxColour = boxColour;
    }

    public Country getDestinationCountry() {
        return destinationCountry;
    }

    public void setDestinationCountry(Country destinationCountry) {
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

    public ShipmentStatus getShipmentStatus() {
        return shipmentStatus;
    }

    public void setShipmentStatus(ShipmentStatus shipmentStatus) {
        this.shipmentStatus = shipmentStatus;
    }

    public Date getCreatedAt() { return createdAt;}

    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}



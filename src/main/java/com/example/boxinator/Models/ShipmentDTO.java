package com.example.boxinator.Models;

import com.example.boxinator.Models.Enums.ShipmentStatus;

public class ShipmentDTO {
    private Long weight;
    private String boxColour;
    private String destinationCountry;
    private String receiver;
    private String sourceCountry;
    private ShipmentStatus shipmentStatus;
    
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

    public String getDestinationCountry() { return destinationCountry;}

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

    public ShipmentStatus getShipmentStatus() {
        return shipmentStatus;
    }

    public void setShipmentStatus(ShipmentStatus shipmentStatus) {
        this.shipmentStatus = shipmentStatus;
    }





}

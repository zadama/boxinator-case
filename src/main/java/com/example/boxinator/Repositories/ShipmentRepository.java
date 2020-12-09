package com.example.boxinator.Repositories;

import com.example.boxinator.Models.Enums.ShipmentStatus;
import com.example.boxinator.Models.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    List<Shipment> findAllByShipmentStatus(ShipmentStatus shipmentStatus);
}

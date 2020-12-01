package com.example.boxinator.Repositories;

import com.example.boxinator.Models.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
}

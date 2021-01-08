package com.example.boxinator.Repositories;

import com.example.boxinator.Models.Account;
import com.example.boxinator.Models.Enums.AccountRole;
import com.example.boxinator.Models.Enums.ShipmentStatus;
import com.example.boxinator.Models.Shipment;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
class ShipmentRepositoryTest {

@Autowired
private ShipmentRepository shipmentRepository;

@Autowired
private AccountRepository accountRepository;

    @Test
    @DisplayName("Testing_Find_All_By_Shipment_Status_CANCELLED")
    void testFindAllByShipmentStatus() {
        //Given
        Account account = new Account();
        account.setRole(AccountRole.ADMIN);
        account.setPassword("321356a!");
        account.setEmail("Joe.daryn@gmail.com");
        account.setFirstName("Oscar");
        account.setLastName("Dahlquist");
        account.setContactNumber((long)580683521);
        account.setCountry("Testland");
        account.setZipCode(206821);
        accountRepository.save(account);

        Shipment shipment = new Shipment();
                shipment.setAccount(account);
                shipment.setBoxColour("Indigo");
                shipment.setShipmentStatus(ShipmentStatus.CANCELLED);
                shipment.setWeight((long)33);
                shipment.setReceiver("Bob");
                shipment.setSourceCountry("Sweden");
                shipment.setTotalPrice(56.0);
                shipmentRepository.save(shipment);
        //When
        List<Shipment> res = shipmentRepository.findAllByShipmentStatus(ShipmentStatus.CANCELLED);
        //Then
        assertEquals(false,res.isEmpty());
        shipmentRepository.delete(shipment);
        accountRepository.delete(account);

    }

    @Test
    @DisplayName("Testing_Find_All_By_Account")
    void testFindAllByAccount() {
        //Given
        Account account = new Account();
        account.setRole(AccountRole.ADMIN);
        account.setPassword("321356a!");
        account.setEmail("Joe.daryn@gmail.com");
        account.setFirstName("Oscar");
        account.setLastName("Dahlquist");
        account.setContactNumber((long)580683521);
        account.setCountry("Testland");
        account.setZipCode(206821);
        accountRepository.save(account);

        Shipment shipment = new Shipment();
        shipment.setAccount(account);
        shipment.setBoxColour("Indigo");
        shipment.setShipmentStatus(ShipmentStatus.CANCELLED);
        shipment.setWeight((long)33);
        shipment.setReceiver("Bob");
        shipment.setSourceCountry("Sweden");
        shipment.setTotalPrice(56.0);
        shipmentRepository.save(shipment);

        //When
    List <Shipment> res = shipmentRepository.findAllByAccount(account);
        //Then
        assertEquals(false,res.isEmpty());
        shipmentRepository.delete(shipment);
        accountRepository.delete(account);
    }
}
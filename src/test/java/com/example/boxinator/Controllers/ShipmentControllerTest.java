package com.example.boxinator.Controllers;

import com.example.boxinator.FirebaseToken;
import com.example.boxinator.Models.Country;
import com.example.boxinator.Models.Enums.AccountRole;
import com.example.boxinator.Models.Enums.ShipmentStatus;
import com.example.boxinator.Models.Shipment;
import com.example.boxinator.Models.ShipmentDTO;
import com.example.boxinator.Repositories.CountryRepository;
import com.example.boxinator.Repositories.ShipmentRepository;
import com.example.boxinator.Utils.CommonResponse;
import com.google.firebase.auth.FirebaseAuthException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ShipmentControllerTest {

    @Autowired
    ShipmentRepository shipmentRepository;

    @Autowired
    ShipmentController shipmentController;

    @Autowired
    CountryController countryController;

    private final String testToken = FirebaseToken.token;


    @Test
    @DisplayName("Testing_Create_Shipment")
    void createShipment() {
        //Given

        ShipmentDTO shipmentDTO = new ShipmentDTO();
        shipmentDTO.setReceiver("Test Testsson");
        shipmentDTO.setSourceCountry("Sweden");
        shipmentDTO.setDestinationCountry("Italy");
        shipmentDTO.setBoxColour("lilac");
        shipmentDTO.setWeight((long) 32);
        shipmentDTO.setShipmentStatus(ShipmentStatus.CREATED);

        //When
        ResponseEntity<CommonResponse> cr = shipmentController.createShipment(testToken, shipmentDTO);

        //Then
        assertEquals(HttpStatus.CREATED, cr.getStatusCode());
        Shipment result = (Shipment) cr.getBody().data;
        shipmentController.deleteShipment(testToken, result.getId());
    }

    @Test
    @DisplayName("Testing_Get_Shipment_By_Id_With_Valid_Token")
    void getShipment() {
        //Given
        ShipmentDTO shipmentDTO = new ShipmentDTO();
        shipmentDTO.setReceiver("Test Testsson");
        shipmentDTO.setSourceCountry("Sweden");
        shipmentDTO.setDestinationCountry("Italy");
        shipmentDTO.setBoxColour("lilac");
        shipmentDTO.setWeight((long) 32);
        shipmentDTO.setShipmentStatus(ShipmentStatus.CREATED);


        //When
        ResponseEntity<CommonResponse> createCr = shipmentController.createShipment(testToken, shipmentDTO);
        Shipment result = (Shipment)createCr.getBody().data;
        ResponseEntity<CommonResponse> cr = shipmentController.getShipment(testToken, result.getId());

        //Then
        assertEquals(HttpStatus.OK, cr.getStatusCode());
        shipmentController.deleteShipment(testToken, result.getId());
    }

    @Test
    @DisplayName("Testing_Update_Shipment_By_Id_With_Valid_Token")
    void updateShipmentWithValidToken() {
        //Given
        ShipmentDTO shipmentDTO = new ShipmentDTO();
        shipmentDTO.setReceiver("Test Testsson");
        shipmentDTO.setSourceCountry("Sweden");
        shipmentDTO.setDestinationCountry("Italy");
        shipmentDTO.setBoxColour("lilac");
        shipmentDTO.setWeight((long) 32);
        shipmentDTO.setShipmentStatus(ShipmentStatus.CREATED);


        //When
        ResponseEntity<CommonResponse> createCr = shipmentController.createShipment(testToken, shipmentDTO);
        Shipment result = (Shipment)createCr.getBody().data;
        ResponseEntity<CommonResponse> cr = shipmentController.updateShipment(testToken, result, result.getId());

        //Then
        assertEquals(HttpStatus.CREATED, cr.getStatusCode());
        shipmentController.deleteShipment(testToken, result.getId());
    }

    @Test
    @DisplayName("Testing_Update_Shipment_By_Id_With_Invalid_Token")
    void updateShipmentWithInvalidToken() {
        //Given
        String invalidToken = "Bearer Wgmlgkme";
        ShipmentDTO shipmentToDelete = new ShipmentDTO();
        shipmentToDelete.setReceiver("Testname2 TestSurname2");
        shipmentToDelete.setSourceCountry("Norway");
        shipmentToDelete.setDestinationCountry("Italy");
        shipmentToDelete.setBoxColour("indigo");
        shipmentToDelete.setWeight((long) 32);
        shipmentToDelete.setShipmentStatus(ShipmentStatus.IN_TRANSIT);

        ResponseEntity<CommonResponse> createCr = shipmentController.createShipment(testToken, shipmentToDelete);
        System.out.println(createCr.getBody().msg);
        Shipment shipment = (Shipment) createCr.getBody().data;

        //When

        ResponseEntity<CommonResponse> cr = shipmentController.updateShipment(invalidToken,shipment, shipment.getId());
        shipmentController.deleteShipment(testToken, shipment.getId());

        //Then
        assertNotEquals(HttpStatus.OK, cr.getStatusCode());

    }

    @Test
    @DisplayName("Testing_Delete_Shipment_By_Id_With_Valid_Token")
    void deleteShipment() throws Exception {
        //Given
        ShipmentDTO shipmentToDelete = new ShipmentDTO();
        shipmentToDelete.setReceiver("Testname2 TestSurname2");
        shipmentToDelete.setSourceCountry("Norway");
        shipmentToDelete.setDestinationCountry("Italy");
        shipmentToDelete.setBoxColour("indigo");
        shipmentToDelete.setWeight((long) 32);
        shipmentToDelete.setShipmentStatus(ShipmentStatus.IN_TRANSIT);

        ResponseEntity<CommonResponse> createCr = shipmentController.createShipment(testToken, shipmentToDelete);
        System.out.println(createCr.getBody().msg);
        Shipment shipment = (Shipment) createCr.getBody().data;

        //When
        ResponseEntity<CommonResponse> deleteCr = shipmentController.deleteShipment(testToken, shipment.getId());

        //Then
        assertEquals(HttpStatus.OK, deleteCr.getStatusCode());

    }


    @Test
    @DisplayName("Testing_Get_All_Shipments_As_Admin")
    void getAllShipmentsByRole() throws FirebaseAuthException {
        //Given

        //When
        ResponseEntity<CommonResponse> cr = shipmentController.getAllShipmentsByRole(testToken);

        //Then
        assertEquals(HttpStatus.OK, cr.getStatusCode());
    }


}
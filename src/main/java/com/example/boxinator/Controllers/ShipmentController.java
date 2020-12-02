package com.example.boxinator.Controllers;


import com.example.boxinator.Models.Shipment;
import com.example.boxinator.Repositories.ShipmentRepository;
import com.example.boxinator.Utils.CommonResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping(value = "/api/v1/shipment")
public class ShipmentController {

    @Autowired
    private ShipmentRepository shipmentRepository;

    // * POST/ (create new shipment)
    @PostMapping("/create")
    public ResponseEntity<CommonResponse> createShipment(@RequestBody Shipment shipment) {
        CommonResponse cr = new CommonResponse();

        try {
            shipmentRepository.save(shipment);
            cr.data = shipment;
            cr.msg = "Shipment created";
            cr.status = HttpStatus.CREATED;
        } catch (Exception e) {
            cr.data = null;
            cr.msg = "Shipment could not be created";
            cr.status = HttpStatus.BAD_REQUEST;
        }
        return new ResponseEntity<>(cr, cr.status);
    }

    // * GET/:shipment_id (get details about specific shipment),
    @GetMapping("/{shipment_id}")
    public ResponseEntity<CommonResponse> getShipment(@PathVariable long shipment_id) {
        CommonResponse cr = new CommonResponse();

        Optional<Shipment> shipmentRepo = shipmentRepository.findById(shipment_id);
        Shipment shipment = shipmentRepo.get();

        cr.data = shipment;
        cr.msg = "Shipment found";
        cr.status = HttpStatus.OK;
        System.out.println(shipment);

        return new ResponseEntity<>(cr, cr.status);
    }

// * POST/:shipment_id (used to update a shipment, user can only cancel, admin can change status
    @PatchMapping("/{shipment_id}")
    public ResponseEntity<CommonResponse> updateShipment(@PathVariable long shipment_id){
        CommonResponse cr = new CommonResponse();

        Optional<Shipment> shipmentRepo = shipmentRepository.findById(shipment_id);
        Shipment shipment = shipmentRepo.orElse(null);

        try {
            shipmentRepository.save(shipment);
            cr.data = shipment;
            cr.msg = "Shipment created";
            cr.status = HttpStatus.CREATED;

        }
        catch(Exception e){
            cr.status = HttpStatus.BAD_REQUEST;
        }
        return new ResponseEntity<>(cr.status);
    }
    // *  DELETE/:shipment_id Only accessible by admin, only in extreme situations, can delete complete/cancelled shipments
    @DeleteMapping("/{shipment_id}")
    public ResponseEntity<CommonResponse> deleteShipment(@PathVariable long shipment_id){
        CommonResponse cr = new CommonResponse();

        Optional<Shipment> shipmentRepo = shipmentRepository.findById(shipment_id);
        Shipment shipment = shipmentRepo.get();

        try {
            cr.data = shipment;
          shipmentRepository.deleteById(shipment_id);
            cr.msg = "Shipment deleted";
            cr.status = HttpStatus.CREATED;
        }
        catch(Exception e){

        }
        return new ResponseEntity<>(cr.status);
    }
    //     * GET/ (get all relevant to user, admin sees all, non-cancelled, non-complete, can be filtered using status or date)
    @GetMapping("/all")
    public ResponseEntity<CommonResponse> getAllShipments() {
        CommonResponse cr = new CommonResponse();

        cr.data = shipmentRepository.findAll();
        cr.msg = "All shipments found";
        cr.status = HttpStatus.OK;

        System.out.println(cr.data);

        return new ResponseEntity<>(cr, cr.status);
    }
    /*
    * GET/complete
    * GET/cancelled
    * GET/complete/:shipment_id (get details about specific completed shipment),
    * GET/:customer_id (get all shipments by a customer)
    * GET/complete/:customer_id (get all complete shipments by a customer)
    * GET/:customer_id/:shipment_id (get a specific shipment by a customer)

    *
    * */

}

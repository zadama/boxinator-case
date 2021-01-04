package com.example.boxinator.Controllers;


import com.example.boxinator.Models.Account;

import com.example.boxinator.Models.Country;
import com.example.boxinator.Models.Enums.AccountRole;
import com.example.boxinator.Models.Shipment;
import com.example.boxinator.Models.ShipmentDTO;
import com.example.boxinator.Models.Enums.ShipmentStatus;
import com.example.boxinator.Repositories.AccountRepository;
import com.example.boxinator.Repositories.CountryRepository;
import com.example.boxinator.Repositories.ShipmentRepository;
import com.example.boxinator.Utils.AuthService.AuthResponse;
import com.example.boxinator.Utils.AuthService.AuthenticationService;
import com.example.boxinator.Utils.CommonResponse;
import com.google.api.Http;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/v1/shipment")
public class ShipmentController {

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private CountryRepository countryRepository;

    @Autowired
    AuthenticationService authService;

    // * POST/ (create new shipment)
    @PostMapping("/create")
    public ResponseEntity<CommonResponse> createShipment(
            @RequestHeader(value = "Authorization") String token,
            @RequestBody ShipmentDTO shipmentDTO
    ) {
        CommonResponse cr = new CommonResponse();
        ResponseEntity<AuthResponse> authResponse = authService.checkToken(token);

        if (authResponse.getStatusCode() == HttpStatus.OK) {
            try {
                Shipment shipment = new Shipment();
                shipment.setAccount(authResponse.getBody().account);
                shipment.setBoxColour(shipmentDTO.getBoxColour());
                shipment.setReceiver(shipmentDTO.getReceiver());
                shipment.setWeight(shipmentDTO.getWeight());
                shipment.setShipmentStatus(shipmentDTO.getShipmentStatus());
                shipment.setSourceCountry(shipmentDTO.getSourceCountry());

                Optional<Country> coutryRepo = countryRepository.findByName(shipmentDTO.getDestinationCountry());
                Country country = coutryRepo.orElse(null);
                shipment.setDestinationCountry(country);
                // Must be calculated AFTER the the DestinationCountry is set.
                shipment.setTotalPrice(shipmentDTO.getWeight() * shipment.getDestinationCountry().getFeeMultiplier());

                shipmentRepository.save(shipment);
                cr.data = shipment;
                cr.msg = "Shipment created";
                cr.status = HttpStatus.CREATED;
            } catch (DataIntegrityViolationException e) {
                cr.data = e.getMessage();
                cr.msg = "Some required field might be missing.";
                cr.status = HttpStatus.BAD_REQUEST;
            } catch (Exception e) {
                cr.data = e.getMessage();
                cr.msg = "Shipment could not be created";
                cr.status = HttpStatus.CONFLICT;
            }
        } else {
            cr.data = authService.checkToken(token).getBody().msg;
            cr.msg = "Unauthorized: Invalid token.";
            cr.status = HttpStatus.UNAUTHORIZED;
        }
        return new ResponseEntity<>(cr, cr.status);
    }

    // * GET/:shipment_id (get details about specific shipment),
    @GetMapping("/{shipment_id}")
    public ResponseEntity<CommonResponse> getShipment(
            @RequestHeader(value = "Authorization") String token,
            @PathVariable Long shipment_id
    ) {
        CommonResponse cr = new CommonResponse();
        ResponseEntity<AuthResponse> authResponse = authService.checkToken(token);

        if (authResponse.getStatusCode() == HttpStatus.OK) {
            if (authResponse.getBody().account.getRole().equals(AccountRole.ADMIN) ||
                    authResponse.getBody().account.getRole().equals(AccountRole.USER)) {

                if (shipmentRepository.existsById(shipment_id)) {
                    Optional<Shipment> shipmentRepo = shipmentRepository.findById(shipment_id);
                    Shipment shipment = shipmentRepo.orElse(null);

                    cr.data = shipment;
                    cr.msg = "Shipment found";
                    cr.status = HttpStatus.OK;
                } else {
                    cr.msg = "Shipment with id: " + shipment_id + " was not found.";
                    cr.status = HttpStatus.NOT_FOUND;
                }
            } else {
                cr.msg = "Sign in to get shipment by id.";
                cr.status = HttpStatus.UNAUTHORIZED;
            }
        } else {
            cr.data = authResponse.getBody().msg;
            cr.msg = "Unauthorized: Invalid token.";
            cr.status = HttpStatus.UNAUTHORIZED;
        }
        return new ResponseEntity<>(cr, cr.status);
    }

    // * POST/:shipment_id (used to update a shipment, user can only cancel, admin can change status
    @PatchMapping("/{shipment_id}")
    public ResponseEntity<CommonResponse> updateShipment(
            @RequestHeader(value = "Authorization") String token,
            @RequestBody Shipment newShipment,
            @PathVariable Long shipment_id) {
        CommonResponse cr = new CommonResponse();
        ResponseEntity<AuthResponse> authResponse = authService.checkToken(token);

        System.out.println(newShipment.getDestinationCountry().getName());
        System.out.println(shipment_id);
        if (authResponse.getStatusCode() == HttpStatus.OK) {
            if (shipmentRepository.existsById(shipment_id)) {
                Optional<Shipment> shipmentRepo = shipmentRepository.findById(shipment_id);
                Shipment shipment = shipmentRepo.orElse(null);

                if (authResponse.getBody().account.getRole().equals(AccountRole.ADMIN)) {
                    if (newShipment.getWeight() != null) {
                        shipment.setWeight(newShipment.getWeight());
                    }

                    if (newShipment.getBoxColour() != null) {
                        shipment.setBoxColour(newShipment.getBoxColour());
                    }

                    if (newShipment.getReceiver() != null) {
                        shipment.setReceiver(newShipment.getReceiver());
                    }

                    if (newShipment.getDestinationCountry() != null) {
                        Optional<Country>newDestinationCountry=countryRepository.findByName(newShipment.getDestinationCountry().getName());
                        shipment.setDestinationCountry(newDestinationCountry.get());
                    }

                    if (newShipment.getSourceCountry() != null) {
                        shipment.setSourceCountry(newShipment.getSourceCountry());
                    }
                    if (newShipment.getShipmentStatus() != null) {
                        shipment.setShipmentStatus(newShipment.getShipmentStatus());
                    }
                } else if (newShipment.getShipmentStatus() != null &&
                        newShipment.getShipmentStatus().equals(ShipmentStatus.CANCELLED) &&
                        authResponse.getBody().account.getRole().equals(AccountRole.USER)) {
                    shipment.setShipmentStatus(newShipment.getShipmentStatus());
                } else {
                    cr.msg = "Your role does not have permission to do this.";
                    cr.status = HttpStatus.UNAUTHORIZED;
                }
                try {
                    shipmentRepository.save(shipment);
                    cr.data = shipment;
                    cr.msg = "Shipment details have been updated.";
                    cr.status = HttpStatus.CREATED;
                } catch (Exception e) {
                    cr.data = e.getMessage();;
                    cr.msg = "Shipment could not be updated.";
                    cr.status = HttpStatus.CONFLICT;
                }
            } else {
                cr.data = null;
                cr.msg = "Shipment with id: " + shipment_id + " was not found.";
                cr.status = HttpStatus.NOT_FOUND;
            }
        } else {
            cr.data = authResponse.getBody().msg;
            cr.msg = "Unauthorized: Invalid token.";
            cr.status = HttpStatus.UNAUTHORIZED;
        }
        return new ResponseEntity<>(cr, cr.status);
    }

    // *  DELETE/:shipment_id Only accessible by admin, only in extreme situations, can delete complete/cancelled shipments
    @DeleteMapping("/{shipment_id}")
    public ResponseEntity<CommonResponse> deleteShipment(
            @RequestHeader(value = "Authorization") String token,
            @PathVariable Long shipment_id) {
        CommonResponse cr = new CommonResponse();
        ResponseEntity<AuthResponse> authResponse = authService.checkToken(token);

        if (authResponse.getStatusCode() == HttpStatus.OK) {
            if (authResponse.getBody().account.getRole().equals(AccountRole.ADMIN)) {
                Optional<Shipment> shipmentRepo = shipmentRepository.findById(shipment_id);
                Shipment shipment = shipmentRepo.orElse(null);
                try {
                    cr.data = shipment;
                    shipmentRepository.deleteById(shipment_id);
                    cr.msg = "Shipment with id: " + shipment_id + " has been deleted";
                    cr.status = HttpStatus.CREATED;
                } catch (Exception e) {
                    cr.data = e.getMessage();
                    cr.msg = "Unable to delete shipment with id: " + shipment_id;
                    cr.status = HttpStatus.CONFLICT;
                }
            } else {
                cr.data = null;
                cr.msg = "Your role does not have permission to do this.";
                cr.status = HttpStatus.UNAUTHORIZED;
            }
        } else {
            cr.data = authResponse.getBody().msg;
            cr.msg = "Unauthorized: Invalid token.";
            cr.status = HttpStatus.UNAUTHORIZED;
        }
        return new ResponseEntity<>(cr, cr.status);
    }

    //     * GET/ (get all relevant to user, admin sees all, non-cancelled, non-complete, can be filtered using status or date)
    @GetMapping("/all")
    public ResponseEntity<CommonResponse> getAllShipmentsByRole(@RequestHeader(value = "Authorization") String token) {
        CommonResponse cr = new CommonResponse();
        ResponseEntity<AuthResponse> authResponse = authService.checkToken(token);

        if (authResponse.getStatusCode() == HttpStatus.OK) {
            try {
                if (authResponse.getBody().account.getRole().equals(AccountRole.ADMIN)) {
                    cr.data = shipmentRepository.findAll();
                    cr.msg = "List of all shipments in the database.";
                    cr.status = HttpStatus.OK;
                } else if (authResponse.getBody().account.getRole().equals(AccountRole.USER)) {
                    cr.data = shipmentRepository.findAllByAccount(authResponse.getBody().account);
                    cr.msg = "List of all shipments by user.";
                    cr.status = HttpStatus.OK;
                } else {
                    cr.data = null;
                    cr.msg = "You need to be logged in for this action.";
                    cr.data = HttpStatus.UNAUTHORIZED;
                }
            } catch (Exception e) {
                cr.data = e.getMessage();
                cr.msg = "Currently unable to get list of all shipments.";
                cr.status = HttpStatus.CONFLICT;
            }
        } else {
            cr.data = authResponse.getBody().msg;
            cr.msg = "Unauthorized: Invalid token.";
            cr.status = HttpStatus.UNAUTHORIZED;
        }
        return new ResponseEntity<>(cr, cr.status);
    }

    //    * GET/:customer_id (get all shipments by a customer) Redundant? Due to the endpoint above having the functionality
    @GetMapping("/all/{account_id}")
    public ResponseEntity<CommonResponse> getAllShipmentsByAccount(
            @RequestHeader(value = "Authorization") String token,
            @PathVariable Long account_id
    ) {
        CommonResponse cr = new CommonResponse();
        ResponseEntity<AuthResponse> authResponse = authService.checkToken(token);

        Optional<Account> accountRepo = accountRepository.findById(account_id);
        Account account = accountRepo.orElse(null);

        if (authResponse.getStatusCode() == HttpStatus.OK) {
            if (authResponse.getBody().account.getRole().equals(AccountRole.ADMIN)) {
                try {
                    cr.data = account.getShipments();
                    cr.msg = "All shipments found for customer";
                    cr.status = HttpStatus.OK;
                } catch (Exception e) {
                    cr.data = e.getMessage();
                    cr.msg = "Unable to find all shipments from account with id: " + account_id;
                    cr.status = HttpStatus.CONFLICT;
                }
            } else {
                cr.data = null;
                cr.msg = "Your role does not have permission to do this.";
                cr.status = HttpStatus.UNAUTHORIZED;
            }
        } else {
            cr.data = authResponse.getBody().msg;
            cr.msg = "Unauthorized: Invalid token.";
            cr.status = HttpStatus.UNAUTHORIZED;
        }
        return new ResponseEntity<>(cr, cr.status);
    }

    //* GET/shipments by shipmentStatus
    @GetMapping("/status/{shipmentStatus}")
    public ResponseEntity<CommonResponse> getAllShipmentsByShipmentStatus(
            @RequestHeader(value = "Authorization") String token,
            @PathVariable("shipmentStatus") Long shipmentStatus
    ) {
        CommonResponse cr = new CommonResponse();
        ResponseEntity<AuthResponse> authResponse = authService.checkToken(token);

        if (authResponse.getStatusCode() == HttpStatus.OK) {
            try {
                ShipmentStatus statusType = ShipmentStatus.values()[shipmentStatus.intValue() - 1];
                cr.data = shipmentRepository.findAllByShipmentStatus(statusType);
                cr.msg = "List of all shipments with status: " + statusType;
                cr.status = HttpStatus.OK;
            } catch (Exception e) {
                cr.data = e.getMessage();
                cr.msg = "Could not retrieve any shipments with status code: " + shipmentStatus;
                cr.status = HttpStatus.INTERNAL_SERVER_ERROR;
            }
        } else {
            cr.data = authResponse.getBody().msg;
            cr.msg = "Unauthorized: Invalid token.";
            cr.status = HttpStatus.UNAUTHORIZED;
        }
        return new ResponseEntity<>(cr, cr.status);
    }
}

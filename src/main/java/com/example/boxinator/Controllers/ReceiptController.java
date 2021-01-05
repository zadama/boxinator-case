package com.example.boxinator.Controllers;

import com.example.boxinator.Models.Account;
import com.example.boxinator.Models.Enums.AccountRole;
import com.example.boxinator.Models.ReceiptDTO;
import com.example.boxinator.Models.Shipment;
import com.example.boxinator.Repositories.AccountRepository;
import com.example.boxinator.Utils.CommonResponse;
import com.example.boxinator.Utils.SendgridService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping(value = "/api/v1/receipt")
public class ReceiptController {

    @Autowired
    private SendgridService sendgridService;

    @Autowired
    private AccountRepository accountRepository;

    @PostMapping("/account")
    public ResponseEntity<CommonResponse> createAnonAccount(@RequestBody Account account) {
        CommonResponse cr = new CommonResponse();

        try {

            Optional<Account> optionalAccount = accountRepository.findByEmail(account.getEmail());

            if (optionalAccount.isPresent()) {

                cr.msg = "Email already exists.";
                cr.status = HttpStatus.CONFLICT;
            } else {

                account.insertGuestValues();
                accountRepository.save(account);
                cr.data = account;
                cr.msg = "Account created";
                cr.status = HttpStatus.CREATED;
            }

        } catch (Exception e) {
            System.out.println(e);

            cr.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(cr, cr.status);

    }


    @PostMapping()
    public ResponseEntity<CommonResponse> createShipmentReceipt(@RequestBody ReceiptDTO receiptDTO) {

        return sendgridService.sendReceipt(receiptDTO.getRecipient(), receiptDTO.getReceiver(), receiptDTO.getDestinationCountry(), receiptDTO.getSourceCountry(), receiptDTO.getBoxColour(), receiptDTO.getWeight());

    }


}

package com.example.boxinator.Controllers;


import com.example.boxinator.Models.Account;
import com.example.boxinator.Repositories.AccountRepository;
import com.example.boxinator.Utils.CommonResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping(value = "/api/v1/account")
public class AccountController {

    @Autowired
    private AccountRepository accountRepository;

    @PostMapping("/create")
    public ResponseEntity<CommonResponse> createAccount(@RequestBody Account account) {
        CommonResponse cr = new CommonResponse();

        try {
            accountRepository.save(account);
            cr.data = account;
            cr.msg = "Account created";
            cr.status = HttpStatus.CREATED;
        } catch (Exception e) {
            cr.data = null;
            cr.msg = "Account could not be created";
            cr.status = HttpStatus.BAD_REQUEST;
        }

        return new ResponseEntity<>(cr, cr.status);
    }

    @GetMapping("/all")
    public ResponseEntity<CommonResponse> getAllAccounts() {
        CommonResponse cr = new CommonResponse();

        cr.data = accountRepository.findAll();
        cr.msg = "All accounts found";
        cr.status = HttpStatus.OK;

        System.out.println(cr.data);

        return new ResponseEntity<>(cr, cr.status);
    }

    @GetMapping("/{account_id}")
    public ResponseEntity<CommonResponse> getAccount(@PathVariable long account_id) {
        CommonResponse cr = new CommonResponse();

        Optional<Account> accountRepo = accountRepository.findById(account_id);
        Account account = accountRepo.get();

        cr.data = account;
        cr.msg = "Account found";
        cr.status = HttpStatus.OK;
        System.out.println(account);

        return new ResponseEntity<>(cr, cr.status);
    }

    @PutMapping("/{account_id}")
    public ResponseEntity<CommonResponse> changeAccountDetails(@PathVariable long account_id, @RequestBody Account account) {
        CommonResponse cr = new CommonResponse();


        return new ResponseEntity<>(cr, cr.status);
    }

    // GET/account/:account_id(CHECK), PUT/account/:account_id, POST/account/, DELETE/account/:account_id(ONLY IN EXTREME SITUATIONS)
    // POST/login

}

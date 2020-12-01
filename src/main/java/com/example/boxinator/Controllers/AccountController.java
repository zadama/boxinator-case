package com.example.boxinator.Controllers;


import com.example.boxinator.Models.Account;
import com.example.boxinator.Repositories.AccountRepository;
import com.example.boxinator.Utils.CommonResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/v1/account")
public class AccountController {

    @Autowired
    private AccountRepository accountRepository;

    @PostMapping
    public ResponseEntity<CommonResponse> createAccount(@RequestBody Account account) {
        CommonResponse cr = new CommonResponse();

        try {
            accountRepository.save(account);
            cr.status = HttpStatus.CREATED;
        } catch (Exception e) {
            cr.status = HttpStatus.UNAUTHORIZED;
        }

        cr.data = account;
        cr.msg = "test";

        return new ResponseEntity<>(cr, cr.status);
    }

    // GET/account/:account_id, PUT/account/:account_id, POST/account/, DELETE/account/:account_id(ONLY IN EXTREME SITUATIONS)
    // POST/login

}

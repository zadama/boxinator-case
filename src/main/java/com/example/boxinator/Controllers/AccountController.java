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

        return new ResponseEntity<>(cr, cr.status);
    }

    @GetMapping("/{account_id}")
    public ResponseEntity<CommonResponse> getAccount(@PathVariable long account_id) {
        CommonResponse cr = new CommonResponse();

        Optional<Account> accountRepo = accountRepository.findById(account_id);
        Account account = accountRepo.orElse(null);

        cr.data = account;
        cr.msg = "Account found";
        cr.status = HttpStatus.OK;

        return new ResponseEntity<>(cr, cr.status);
    }

    @PatchMapping("/{account_id}")
    public ResponseEntity<CommonResponse> changeAccountDetails(@PathVariable long account_id, @RequestBody Account changedAccount) {
        CommonResponse cr = new CommonResponse();

        if(accountRepository.existsById(account_id)) {
            Optional<Account> accountRepo = accountRepository.findById(account_id);
            Account account = accountRepo.orElse(null);
            if (account != null) {
                if (changedAccount.getFirstName() != null) { account.setFirstName(changedAccount.getFirstName()); }

                if (changedAccount.getLastName() != null) { account.setLastName(changedAccount.getLastName()); }

                if (changedAccount.getEmail() != null) { account.setEmail(changedAccount.getEmail()); }

                if (changedAccount.getPassword() != null) { account.setPassword(changedAccount.getPassword()); }

                if (changedAccount.getDateOfBirth() != null) { account.setDateOfBirth(changedAccount.getDateOfBirth()); }

                if (changedAccount.getCountry() != null) { account.setCountry(changedAccount.getCountry()); }

                if (changedAccount.getZipCode() != 0) { account.setZipCode(changedAccount.getZipCode()); }

                if (changedAccount.getContactNumber() != 0) { account.setContactNumber(changedAccount.getContactNumber()); }

                if (changedAccount.getRole() != null) { account.setRole(changedAccount.getRole()); }

                try {
                    Account newAccount = accountRepository.save(account);
                    cr.data = newAccount;
                    cr.msg = newAccount != null ? "Account changed!" : "This service is currently unavailable.";
                    cr.status = newAccount != null ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
                } catch (Exception e) {
                    cr.status = HttpStatus.BAD_REQUEST;
                }
            }

        } else {
            cr.data = null;
            cr.msg = "Account not found.";
            cr.status = HttpStatus.NOT_FOUND;
        }

        return new ResponseEntity<>(cr, cr.status);
    }

    @DeleteMapping("/{account_id}")
    public ResponseEntity<CommonResponse> deleteAccount(@PathVariable long account_id) {
        CommonResponse cr = new CommonResponse();

        Optional<Account> accountRepo = accountRepository.findById(account_id);
        Account account = accountRepo.orElse(null);

        if (account != null) {
            accountRepository.deleteById(account_id);
            cr.data = null;
            cr.msg = "Account deleted.";
            cr.status = HttpStatus.OK;
        } else {
            cr.data = account;
            cr.msg = "Account could not be deleted.";
            cr.status = HttpStatus.BAD_REQUEST;
        }

        return new ResponseEntity<>(cr, cr.status);
    }

    // GET/account/:account_id(CHECK), PUT/account/:account_id(CHECK), POST/account/(CHECK), DELETE/account/:account_id(ONLY IN EXTREME SITUATIONS)()
    // POST/login()

}

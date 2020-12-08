package com.example.boxinator.Controllers;



import com.example.boxinator.Models.Account;
import com.example.boxinator.Models.Enums.AccountRole;
import com.example.boxinator.Repositories.AccountRepository;
import com.example.boxinator.Utils.AuthService.AuthResponse;
import com.example.boxinator.Utils.AuthService.AuthenticationService;
import com.example.boxinator.Utils.CommonResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping(value = "/api/v1/account")
public class AccountController {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AuthenticationService authService;

    @PostMapping("/register")
    public ResponseEntity<CommonResponse> createAccount(@RequestBody Account account) {
        CommonResponse cr = new CommonResponse();

        try {
            accountRepository.save(account);
            cr.data = account;
            cr.msg = "Account created";
            cr.status = HttpStatus.CREATED;
        } catch(DataIntegrityViolationException e) {
            if (e.getCause().toString().contains("PropertyValueException")) {
                cr.msg = "Some required field might be missing.";
            } else {
                cr.msg = "Some value already exists.";
            }
            cr.status = HttpStatus.BAD_REQUEST;
        } catch (Exception e) {
            cr.msg = "This service is currently unavailable.";
            cr.status = HttpStatus.CONFLICT;
        }

        return new ResponseEntity<>(cr, cr.status);
    }

//    @PostMapping("/login") // ADD LOGINREQUEST MODEL
//    public ResponseEntity<CommonResponse> login(@RequestBody LoginRequest loginRequest) {
//        CommonResponse cr = new CommonResponse();
//
//        cr.data = null;
//        cr.msg = "login";
//        cr.status = HttpStatus.OK;
//
//        return new ResponseEntity<>(cr, cr.status);
//    }

    @GetMapping("/all")
    public ResponseEntity<CommonResponse> getAllAccounts() {
        CommonResponse cr = new CommonResponse();

        try {
            cr.data = accountRepository.findAll();
            cr.msg = "List of all existing accounts in the database.";
            cr.status = HttpStatus.OK;
        } catch (Exception e){
            cr.msg = "Currently unable to get the list of all accounts in the database.";
            cr.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(cr, cr.status);
    }

    @GetMapping("/{account_id}")
    public ResponseEntity<CommonResponse> getAccount(
            @RequestHeader(value = "Authorization") String token,
            @PathVariable long account_id
    ) {
        CommonResponse cr = new CommonResponse();
        ResponseEntity<AuthResponse> authResponse = authService.checkToken(token);

        if (authResponse.getStatusCode() == HttpStatus.OK) {
            if (accountRepository.existsById(account_id)){
                try {
                    Optional<Account> accountRepo = accountRepository.findById(account_id);
                    Account account = accountRepo.orElse(null);

                    cr.data = account;
                    cr.msg = "Account found";
                    cr.status = HttpStatus.OK;
                } catch (Exception e) {
                    cr.msg = e.getMessage();
                    cr.status = HttpStatus.BAD_REQUEST;
                }
            } else {
                cr.msg = "Account with id: "+account_id+" could not be found";
                cr.status = HttpStatus.NOT_FOUND;
            }
        } else {
            cr.data = authResponse.getBody().msg;
            cr.msg = "Unauthorized: Invalid token.";
            cr.status = HttpStatus.UNAUTHORIZED;
        }

        return new ResponseEntity<>(cr, cr.status);
    }

    @PatchMapping("/{account_id}")
    public ResponseEntity<CommonResponse> changeAccountDetails(
            @RequestHeader(value = "Authorization") String token,
            @PathVariable long account_id,
            @RequestBody Account changedAccount
    ) {
        CommonResponse cr = new CommonResponse();
        ResponseEntity<AuthResponse> authResponse = authService.checkToken(token);

        if (authResponse.getStatusCode() == HttpStatus.OK) {
            if(accountRepository.existsById(account_id)) {
                Optional<Account> accountRepo = accountRepository.findById(account_id);
                Account account = accountRepo.orElse(null);
                cr.msg = "You do not have permission to change: ";
                if (account != null) {
                    if (changedAccount.getFirstName() != null) { account.setFirstName(changedAccount.getFirstName()); }

                    if (changedAccount.getLastName() != null) { account.setLastName(changedAccount.getLastName()); }

                    if (changedAccount.getEmail() != null) { account.setEmail(changedAccount.getEmail()); }

                    if (changedAccount.getPassword() != null) { account.setPassword(changedAccount.getPassword()); }

                    if (changedAccount.getDateOfBirth() != null) { account.setDateOfBirth(changedAccount.getDateOfBirth()); }

                    if (changedAccount.getCountry() != null) { account.setCountry(changedAccount.getCountry()); }

                    if (changedAccount.getZipCode() != 0) { account.setZipCode(changedAccount.getZipCode()); }

                    if (changedAccount.getContactNumber() != 0) { account.setContactNumber(changedAccount.getContactNumber()); }

                    if (changedAccount.getRole() != null && authResponse.getBody().account.getRole().equals(AccountRole.ADMIN)) {
                        account.setRole(changedAccount.getRole());
                    } else {
                        cr.msg += "Role ";
                    }

                    try {
                        Account newAccount = accountRepository.save(account);
                        cr.data = newAccount;
                        cr.msg += newAccount != null ? " Account changed!" : " This service is currently unavailable.";
                        cr.status = newAccount != null ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
                    } catch (Exception e) {
                        cr.status = HttpStatus.BAD_REQUEST;
                    }
                }
            } else {
                cr.data = null;
                cr.msg = "Account with id: "+account_id+" could not be found";
                cr.status = HttpStatus.NOT_FOUND;
            }
        } else {
            cr.data = authResponse.getBody().msg;
            cr.msg = "Unauthorized: Invalid token.";
            cr.status = HttpStatus.UNAUTHORIZED;
        }

        return new ResponseEntity<>(cr, cr.status);
    }

    @DeleteMapping("/{account_id}")
    public ResponseEntity<CommonResponse> deleteAccount(
            @RequestHeader(value = "Authorization") String token,
            @PathVariable long account_id
    ) {
        CommonResponse cr = new CommonResponse();
        ResponseEntity<AuthResponse> authResponse = authService.checkToken(token);

        if (authResponse.getStatusCode() == HttpStatus.OK) {
            if (authResponse.getBody().account.getRole().equals(AccountRole.ADMIN)) {
                Optional<Account> accountRepo = accountRepository.findById(account_id);
                Account account = accountRepo.orElse(null);

                if (account != null) {
                    accountRepository.deleteById(account_id);
                    cr.data = account;
                    cr.msg = "Account with id: "+account_id+" deleted.";
                    cr.status = HttpStatus.OK;
                } else {
                    cr.data = null;
                    cr.msg = "Account with id: "+account_id+" could not be found";
                    cr.status = HttpStatus.NOT_FOUND;
                }
            } else {
                cr.data = authResponse.getBody().msg;
                cr.msg = "Unauthorized: Your role does not have permission to do this.";
                cr.status = HttpStatus.UNAUTHORIZED;
            }
        } else {
            cr.data = authResponse.getBody().msg;
            cr.msg = "Unauthorized: Invalid token.";
            cr.status = HttpStatus.UNAUTHORIZED;
        }
        return new ResponseEntity<>(cr, cr.status);
    }
}

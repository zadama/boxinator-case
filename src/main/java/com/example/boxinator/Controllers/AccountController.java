package com.example.boxinator.Controllers;

import com.example.boxinator.Models.Account;
import com.example.boxinator.Models.Enums.AccountRole;
import com.example.boxinator.Models.LoginRequest;
import com.example.boxinator.Repositories.AccountRepository;
import com.example.boxinator.Utils.AuthService.AuthResponse;
import com.example.boxinator.Utils.AuthService.AuthenticationService;
import com.example.boxinator.Utils.CommonResponse;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping(value = "/api/v1/account")
public class AccountController {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AuthenticationService authService;

    @Autowired
    private PasswordEncoder encoder;

    @PostMapping("/register")
    public ResponseEntity<CommonResponse> createAccount(@RequestBody Account account) {
        CommonResponse cr = new CommonResponse();

        try {
            String hashedPW = encoder.encode(account.getPassword());
            account.setPassword(hashedPW);

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
            cr.data = e.getMessage();
            cr.msg = "This service is currently unavailable.";
            cr.status = HttpStatus.CONFLICT;
        }

        return new ResponseEntity<>(cr, cr.status);
    }

    @PostMapping("/login")
    public ResponseEntity<CommonResponse> login(@RequestBody LoginRequest loginReq) {
        CommonResponse cr = new CommonResponse();

        try {
            Optional<Account> foundAccountRepo = accountRepository.findByEmail(loginReq.getEmail());
            Account foundAccount = foundAccountRepo.orElse(null);

            if (foundAccount != null && encoder.matches(loginReq.getPassword(), foundAccount.getPassword())) {
                cr.data = foundAccount;
                cr.msg = "Valid user login.";
                cr.status = HttpStatus.OK;
            } else {
                cr.data = null;
                cr.msg = "Incorrect credentials.";
                cr.status = HttpStatus.UNAUTHORIZED;
            }

        } catch (Exception e) {
            cr.msg = "Error occured";
            cr.status = HttpStatus.CONFLICT;
        }

        return new ResponseEntity<>(cr, cr.status);
    }

    @GetMapping("/all")
    public ResponseEntity<CommonResponse> getAllAccounts() {
        CommonResponse cr = new CommonResponse();

        System.out.println("HERE");
        try {
            cr.data = accountRepository.findAll();
            cr.msg = "List of all existing accounts in the database.";
            cr.status = HttpStatus.OK;
        } catch (Exception e){
            System.out.println("erroooor");

            e.printStackTrace();
            cr.msg = "Currently unable to get the list of all accounts in the database.";
            cr.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(cr, cr.status);
    }

    @GetMapping("/get/{account_email}")
    public ResponseEntity<CommonResponse> getAccount(
            @RequestHeader(value = "Authorization") String token,
            @PathVariable String account_email
    ) {
        CommonResponse cr = new CommonResponse();
        ResponseEntity<AuthResponse> authResponse = authService.checkToken(token);

        if (authResponse.getStatusCode() == HttpStatus.OK) {
            try {
                Optional<Account> accountRepo = accountRepository.findByEmail(account_email);
                Account account = accountRepo.orElse(null);

                cr.data = account;
                cr.msg = "Account found";
                cr.status = HttpStatus.OK;
            } catch (Exception e) {
                cr.data = "Account with email: "+account_email+" could not be found";
                cr.msg = e.getMessage();
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
            @PathVariable Long account_id,
            @RequestBody Account changedAccount
    ) throws Exception {
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

                    if (changedAccount.getEmail() != null) {
                        UserRecord.UpdateRequest req = new UserRecord.UpdateRequest(
                                FirebaseAuth.getInstance().getUserByEmail(account.getEmail()).getUid())
                                .setEmail(changedAccount.getEmail());
                        FirebaseAuth.getInstance().updateUser(req);
                        account.setEmail(changedAccount.getEmail());
                    }

                    if (changedAccount.getPassword() != null) { account.setPassword(changedAccount.getPassword()); }

                    if (changedAccount.getDateOfBirth() != null) { account.setDateOfBirth(changedAccount.getDateOfBirth()); }

                    if (changedAccount.getCountry() != null) { account.setCountry(changedAccount.getCountry()); }

                    if (changedAccount.getZipCode() != 0) { account.setZipCode(changedAccount.getZipCode()); }

                    if (changedAccount.getContactNumber() != null) { account.setContactNumber(changedAccount.getContactNumber()); }

                    if (changedAccount.getRole() != null
                            && !authResponse.getBody().account.getRole().equals(AccountRole.ADMIN)
                            && changedAccount.getRole().equals(AccountRole.ADMIN)) {
                        throw new Exception("UNAUTHORIZED! You can not change role to ADMIN.");
                    } else if (changedAccount.getRole() != null){
                        account.setRole(changedAccount.getRole());
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
            @PathVariable Long account_id
    ) throws FirebaseAuthException {
        CommonResponse cr = new CommonResponse();
        ResponseEntity<AuthResponse> authResponse = authService.checkToken(token);

        if (authResponse.getStatusCode() == HttpStatus.OK) {
            if (authResponse.getBody().account.getRole().equals(AccountRole.ADMIN)) {
                Optional<Account> accountRepo = accountRepository.findById(account_id);
                Account account = accountRepo.orElse(null);

                if (account != null) {
                    FirebaseAuth.getInstance().deleteUser(FirebaseAuth.getInstance().getUserByEmail(account.getEmail()).getUid());
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

    @GetMapping("/role")
    public ResponseEntity<CommonResponse> getUserRole(@RequestHeader(value = "Authorization") String token ) throws FirebaseAuthException {

        CommonResponse cr = new CommonResponse();
        ResponseEntity<AuthResponse> authResponse = authService.checkToken(token);

        if (authResponse.getStatusCode() == HttpStatus.OK) {
                try {


                    cr.data = authResponse.getBody().account.getRole();
                    cr.msg = "Role found";
                    cr.status = HttpStatus.OK;
                } catch (Exception e) {
                    cr.msg = e.getMessage();
                    cr.status = HttpStatus.BAD_REQUEST;
                }

        } else {
            cr.data = authResponse.getBody().msg;
            cr.msg = "Unauthorized: Invalid token.";
            cr.status = HttpStatus.UNAUTHORIZED;
        }

        return new ResponseEntity<>(cr, cr.status);
    }
}

package com.example.boxinator.Controllers;

import com.example.boxinator.Models.Account;
import com.example.boxinator.Repositories.AccountRepository;
import com.example.boxinator.Utils.CommonResponse;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/v1/accounttest")
public class AccountTest {

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

    @GetMapping("/checktoken")
    public String checkToken(@RequestHeader(value = "Authorization") String token , HttpServletRequest request) throws FirebaseAuthException {
        String [] authToken = token.split(" ");
        String bearerToken = authToken[1];


        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(bearerToken);
        String email = decodedToken.getEmail();

        System.out.println(email);


        return email;
    }

    @GetMapping("/role")
    public String getUserRole(@RequestHeader(value = "Authorization") String token ) throws FirebaseAuthException {
        String [] authToken = token.split(" ");
        String bearerToken = authToken[1];

        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(bearerToken);
        String email = decodedToken.getEmail();

        Optional<Account> account = accountRepository.findByEmail(email);


         return account.isPresent() ? account.get().getRole(): "Not found..";
    }
}

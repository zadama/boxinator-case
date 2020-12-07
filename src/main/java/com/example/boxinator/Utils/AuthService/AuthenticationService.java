package com.example.boxinator.Utils.AuthService;

import com.example.boxinator.Models.Account;
import com.example.boxinator.Repositories.AccountRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthenticationService {

    @Bean
    @ConditionalOnMissingBean
    public MyAuthService authService() {
        return new MyAuthService();
    }

    @Autowired
    AccountRepository accountRepository;

    public ResponseEntity<AuthResponse> checkToken(String token) {
        String [] authToken = token.split(" ");
        String bearerToken = authToken[1];
        AuthResponse res = new AuthResponse();

        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(bearerToken);
            String email = decodedToken.getEmail();

            Optional<Account> accountRepo = accountRepository.findByEmail(email);

            res.account = accountRepo.orElse(null);
            res.msg = "Account verified";
            res.status = HttpStatus.OK;
        } catch (FirebaseAuthException e) {
            res.account = null;
            res.msg = e.getMessage();
            res.status = HttpStatus.UNAUTHORIZED;
        }

        return new ResponseEntity<>(res, res.status);
    }

}

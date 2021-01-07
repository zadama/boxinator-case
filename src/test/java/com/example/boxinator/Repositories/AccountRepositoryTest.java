package com.example.boxinator.Repositories;

import com.example.boxinator.Models.Account;
import com.example.boxinator.Utils.CommonResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
class AccountRepositoryTest {

@Autowired
private AccountRepository accountRepository;

// You will need a valid testToken for some of the tests

/*Instructions for how to get a valid testToken:
    1. login via the front-end.
    2. Inspect browser.
    3. Go to Network tab
    4. Refresh page
    5. Find the header "Name" and click on token?key=
    6. Copy the entire id_token
    7.Paste into the string testToken below after the "Bearer ...". in the class FirebaseToken.
*/


    @Test
    @DisplayName("Testing_Find_By_Email")
    void findByEmail() {
        //Given
        String testEmail ="oscar.dahlquist@gmail.com";

        //When
        Optional<Account> res = accountRepository.findByEmail(testEmail);

        //Then
        assertEquals(false,res.isEmpty());
    }
}
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
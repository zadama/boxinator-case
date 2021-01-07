package com.example.boxinator.Controllers;

import com.example.boxinator.Models.Account;
import com.example.boxinator.Models.Enums.AccountRole;
import com.example.boxinator.Models.LoginRequest;
import com.example.boxinator.Repositories.AccountRepository;
import com.example.boxinator.Utils.CommonResponse;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.util.Assert;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
class AccountControllerTest {

@Autowired
private AccountRepository accountRepository;

@Autowired
private AccountController accountController;

//Instructions for how to get a valid testToken:

private final String testToken= "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImUwOGI0NzM0YjYxNmE0MWFhZmE5MmNlZTVjYzg3Yjc2MmRmNjRmYTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYm94aW5hdG9yLWZjZDRjIiwiYXVkIjoiYm94aW5hdG9yLWZjZDRjIiwiYXV0aF90aW1lIjoxNjA4MDQyNzQwLCJ1c2VyX2lkIjoiTGpQcjdXTjJWVGhiZzJ5NTZVSlBabXphWTNnMiIsInN1YiI6IkxqUHI3V04yVlRoYmcyeTU2VUpQWm16YVkzZzIiLCJpYXQiOjE2MDk5NjEyODIsImV4cCI6MTYwOTk2NDg4MiwiZW1haWwiOiJvc2Nhci5kYWhscXVpc3RAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsib3NjYXIuZGFobHF1aXN0QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIiwic2lnbl9pbl9zZWNvbmRfZmFjdG9yIjoicGhvbmUiLCJzZWNvbmRfZmFjdG9yX2lkZW50aWZpZXIiOiI2NjBhNTJiOS0xMWIyLTRiOWQtODRhNi0xZjU1MDBlYTQzMWYifX0.bsXq2zknhS5SLrHPLpYdVJWcVuk2WuJdHy9xKyXswH6YViOyQAQlA2aMGRNVmR5hxS3WrR4661N_4W2blMl_qFV5jLAQMINzCtlBdGMaSSsZQB6Wr5DPi81VZ-6kFVmcc0mmATo-woBfgHo4fF96vQqYh7HvrXCTPuZXH55DHbM2VF3LLa_BRnwxDrkOZUWM6gEQkrVL3h7tYaVGnjYrcuFVOQW_lf-AuDwCy9RibHaaF9jjijh7rPq9nKX-l_CRHJS_TRsr_dbqctJ7N0Sr7cSgRmEKtX3hTsJAhQ5lyc5kN42uJiHkpAMxfBzOXaR8UGU-Twnq5JZ5svDA_A3QCA";

    @Test
    @DisplayName("Testing_Login_With_Valid_Test_Account")
    void Testing_Login_With_Valid_Test_Account() {
        //Given
        LoginRequest loginRequest = new LoginRequest("oscar.dahlquist@gmail.com", "abc123");
        //when
        ResponseEntity<CommonResponse> res =  accountController.login(loginRequest);
        //then
        assertEquals(HttpStatus.OK,res.getBody().status);
    }

    @Test
    @DisplayName("Testing_Login_With_Invalid_Test_Account")
    void Testing_Login_With_Invalid_Test_Account() {
        //Given
        LoginRequest loginRequest = new LoginRequest("oscar.dahlquist@gmail.com", "123abc");
        //when
        ResponseEntity<CommonResponse> res =  accountController.login(loginRequest);
        //then
        assertNotEquals(HttpStatus.OK,res.getBody().status);
    }

    @Test
    @Disabled
    @DisplayName("")
    void getAllAccounts() {
    }


    @Test
    @Disabled
    @DisplayName("")
    void getAccount() {
    }


    @Test
    @Disabled
    @DisplayName("")
    void changeAccountDetails() {
    }

    @Test
    @DisplayName("")
    void deleteAccount() {
    }


    @Test
    @Disabled
    @DisplayName("")
    void getUserRole() {
    }
}
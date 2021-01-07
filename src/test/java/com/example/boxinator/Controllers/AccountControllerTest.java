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

// You will need a valid testToken for some of the tests

/*Instructions for how to get a valid testToken:
    1. login via the front-end.
    2. Inspect browser.
    3. Go to Network tab
    4. Refresh page
    5. Find the header "Name" and click on token?key=
    6. Copy the entire id_token
    7.Paste into the string testToken below after the "Bearer ...".
*/

private final String testToken= "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImUwOGI0NzM0YjYxNmE0MWFhZmE5MmNlZTVjYzg3Yjc2MmRmNjRmYTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYm94aW5hdG9yLWZjZDRjIiwiYXVkIjoiYm94aW5hdG9yLWZjZDRjIiwiYXV0aF90aW1lIjoxNjA4MDQyNzQwLCJ1c2VyX2lkIjoiTGpQcjdXTjJWVGhiZzJ5NTZVSlBabXphWTNnMiIsInN1YiI6IkxqUHI3V04yVlRoYmcyeTU2VUpQWm16YVkzZzIiLCJpYXQiOjE2MTAwMTE4MjIsImV4cCI6MTYxMDAxNTQyMiwiZW1haWwiOiJvc2Nhci5kYWhscXVpc3RAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsib3NjYXIuZGFobHF1aXN0QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIiwic2lnbl9pbl9zZWNvbmRfZmFjdG9yIjoicGhvbmUiLCJzZWNvbmRfZmFjdG9yX2lkZW50aWZpZXIiOiI2NjBhNTJiOS0xMWIyLTRiOWQtODRhNi0xZjU1MDBlYTQzMWYifX0.uruEsNCVfd4qnzDzrHKvwJk6oEIOKW_fGn5IlB3K9OslGC3TFhcIVuvLAg-98mNe4fNowPO2NbHAq0mPaIflwD13KYbRNzD1TOKZ785K4ZoHoLmPaJZlzIFN-A1nJlIchKQm4QeNoQe-TZCdd1F0m2u-fEBJzgu4Le40f7peI6PAkw3shAxEOUoi37YJZiPWVFUaEM-rI7UKL6hjWRjWP8P_SavUZAHm0iUHXJtxDUMQssTaJmKvTOyXekwM0DHnGaGNBFpBp3V4y01eI5Gr765qDAsBRhy3ROI6pb-5x-u03TM_7cNcq_m0rhjfMYQSe1FzrVcCzLQyPK8OdXKZeg";

    @Test
    @DisplayName("Testing_Login_With_Valid_Test_Account")
    void testing_Login_With_Valid_Test_Account() {
        //Given
        LoginRequest loginRequest = new LoginRequest("oscar.dahlquist@gmail.com", "abc123");
        //when
        ResponseEntity<CommonResponse> res =  accountController.login(loginRequest);
        //then
        assertEquals(HttpStatus.OK,res.getBody().status);
    }

    @Test
    @DisplayName("Testing_Login_With_Invalid_Test_Account")
    void testing_Login_With_Invalid_Test_Account() {
        //Given
        LoginRequest loginRequest = new LoginRequest("oscar.dahlquist@gmail.com", "123abc");
        //when
        ResponseEntity<CommonResponse> res =  accountController.login(loginRequest);
        //then
        assertNotEquals(HttpStatus.OK,res.getBody().status);
    }

    @Test
    @DisplayName("Testing_Get_All_Accounts_With_Valid_testToken")
    void testingGetAllAccountsWithValidTestToken() {
        //Given
        String token = testToken;
        //when
        ResponseEntity<CommonResponse> res = accountController.getAllAccounts(token);
        //then
        assertEquals(HttpStatus.OK,res.getBody().status);
    }

    @Test
    @DisplayName("Testing_Get_All_Accounts_With_Invalid_testToken")
    void testingGetAllAccountsWithInvalidTestToken() {
        //Given
        String token = "123 123";
        //when
        ResponseEntity<CommonResponse> res = accountController.getAllAccounts(token);
        //then
        assertNotEquals(HttpStatus.OK,res.getBody().status);
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
    @Disabled
    @DisplayName("")
    void getUserRole() {
    }
}
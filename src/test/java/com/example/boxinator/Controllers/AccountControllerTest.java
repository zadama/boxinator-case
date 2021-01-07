package com.example.boxinator.Controllers;

import com.example.boxinator.Models.Account;
import com.example.boxinator.Models.Enums.AccountRole;
import com.example.boxinator.Models.LoginRequest;
import com.example.boxinator.Repositories.AccountRepository;
import com.example.boxinator.Utils.CommonResponse;
import com.google.firebase.auth.FirebaseAuthException;
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

private final String testToken= "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImUwOGI0NzM0YjYxNmE0MWFhZmE5MmNlZTVjYzg3Yjc2MmRmNjRmYTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYm94aW5hdG9yLWZjZDRjIiwiYXVkIjoiYm94aW5hdG9yLWZjZDRjIiwiYXV0aF90aW1lIjoxNjA4MDQyNzQwLCJ1c2VyX2lkIjoiTGpQcjdXTjJWVGhiZzJ5NTZVSlBabXphWTNnMiIsInN1YiI6IkxqUHI3V04yVlRoYmcyeTU2VUpQWm16YVkzZzIiLCJpYXQiOjE2MTAwMTYyNTQsImV4cCI6MTYxMDAxOTg1NCwiZW1haWwiOiJvc2Nhci5kYWhscXVpc3RAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsib3NjYXIuZGFobHF1aXN0QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIiwic2lnbl9pbl9zZWNvbmRfZmFjdG9yIjoicGhvbmUiLCJzZWNvbmRfZmFjdG9yX2lkZW50aWZpZXIiOiI2NjBhNTJiOS0xMWIyLTRiOWQtODRhNi0xZjU1MDBlYTQzMWYifX0.SxNkxHVhkO9p0mk3x3pf2M9nMSc5b9IrAoDfjKQW7eKaltQR4tIYVIntW1RGghKn8C5_cDXu2tZ0NmpGDAAbz1YWK43zEPtD0WRV3-hTr6mYHH1vzgo26hPw5aU2kGUCjJJp8jeGJrAu3xpqX5HpwAjMY-E4lthUYVOlFlrjd-hPm8zANq4SQP6lrqa-znk8gXZUfJBfl0AweKsNZJBOq_eV_z_ObpkmHEuK4TGnTibuyZSsee8k2iJJPJ5rDeGP1lQW5iP_pRX3Ccb1mt0T2wT_pEBz9uYXYdL2bUIyie2jDGGqr2cQV9wLzXfA01vQOnQW_3_5KCKD5KkTFkj-eg";

    @Test
    @DisplayName("Testing_Login_With_Valid_Test_Account")
    void testing_Login_With_Valid_Test_Account() {
        //Given
        LoginRequest loginRequest = new LoginRequest("oscar.dahlquist@gmail.com", "abc123");
        //When
        ResponseEntity<CommonResponse> res =  accountController.login(loginRequest);
        //Then
        assertEquals(HttpStatus.OK,res.getBody().status);
    }

    @Test
    @DisplayName("Testing_Login_With_Invalid_Test_Account")
    void testing_Login_With_Invalid_Test_Account() {
        //Given
        LoginRequest loginRequest = new LoginRequest("oscar.dahlquist@gmail.com", "123abc");
        //When
        ResponseEntity<CommonResponse> res =  accountController.login(loginRequest);
        //Then
        assertNotEquals(HttpStatus.OK,res.getBody().status);
    }

    @Test
    @DisplayName("Testing_Get_All_Accounts_With_Valid_Test_Token")
    void testingGetAllAccountsWithValidTestToken() {
        //Given
        String token = testToken;
        //When
        ResponseEntity<CommonResponse> res = accountController.getAllAccounts(token);
        //Then
        assertEquals(HttpStatus.OK,res.getBody().status);
    }

    @Test
    @DisplayName("Testing_Get_All_Accounts_With_Invalid_Test_Token")
    void testingGetAllAccountsWithInvalidTestToken() {
        //Given
        String token = "123 123";
        //When
        ResponseEntity<CommonResponse> res = accountController.getAllAccounts(token);
        //Then
        assertNotEquals(HttpStatus.OK,res.getBody().status);
    }

    @Test
    @DisplayName("Testing_Get_Account_With_Valid_Test_Token_And_Valid_Mail")
    void testingGetAccountWithValidTestTokenAndValidMail() {
        //Given
        String token = testToken;
        String testMail ="oscar.dahlquist@gmail.com";
        //When
        ResponseEntity<CommonResponse> res = accountController.getAccount(token,testMail);
        //Then
        assertEquals(HttpStatus.OK, res.getBody().status);
    }


    @Test
    @DisplayName("Testing_Change_Account_Details_First_Name_With_Valid_Token_And_ID")
    void testingChangeAccountDetailsFirstName() throws Exception {
        //Given
        String token = testToken;
        long id = 8;
        String firstName ="Oscar";
        Account account = new Account(firstName);
        //When
        ResponseEntity<CommonResponse> res = accountController.changeAccountDetails(token,id,account);

        //Then
        assertEquals(HttpStatus.OK,res.getBody().status);
    }

    @Test
    @DisplayName("Testing_Get_User_Role_With_Valid_Token")
    void testingGetUserRoleWithValidToken() throws FirebaseAuthException {
        //Given
        String token = testToken;
        //When
        ResponseEntity<CommonResponse> res = accountController.getUserRole(token);

        //Then
        assertEquals(HttpStatus.OK, res.getBody().status);
    }
    @Test
    @DisplayName("Testing_Get_User_Role_With_Invalid_Token")
    void testingGetUserRoleWithInvalidToken() throws FirebaseAuthException {
        //Given
        String token = "123 123";
        //When
        ResponseEntity<CommonResponse> res = accountController.getUserRole(token);

        //Then
        assertNotEquals(HttpStatus.OK, res.getBody().status);
    }

}
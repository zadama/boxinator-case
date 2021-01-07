package com.example.boxinator.Controllers;

import com.example.boxinator.FirebaseToken;
import com.example.boxinator.Models.Account;
import com.example.boxinator.Models.Enums.AccountRole;
import com.example.boxinator.Models.LoginRequest;
import com.example.boxinator.Utils.CommonResponse;
import com.google.firebase.auth.FirebaseAuthException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
class AccountControllerTest {

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
    7.Paste into the string testToken below after the "Bearer ...". in the class FirebaseToken.
*/

private final String testToken= FirebaseToken.token;

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
    @DisplayName("Testing_Get_User_Role_As_Admin_for_Admin")
    void testingGetUserRoleAsAdminForAdmin() throws FirebaseAuthException {
        //Given
        String token = testToken;
        //When
        ResponseEntity<CommonResponse> res = accountController.getUserRole(token);
        //Then
        assertEquals(AccountRole.ADMIN, res.getBody().data);
    }
    @Test
    @DisplayName("Testing_Get_User_Role_As_Admin_For_Wrong_Role(User)")
    void testingGetUserRoleAsAdminForUser() throws FirebaseAuthException {
        //Given
        String token = testToken;
        //When
        ResponseEntity<CommonResponse> res = accountController.getUserRole(token);

        //Then
        assertNotEquals(AccountRole.USER, res.getBody().data);
    }

}
package com.example.boxinator.Controllers;

import com.example.boxinator.Models.Country;
import com.example.boxinator.Utils.CommonResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CountryControllerTest {

@Autowired
private CountryController countryController;

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

    private final String testToken= "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImUwOGI0NzM0YjYxNmE0MWFhZmE5MmNlZTVjYzg3Yjc2MmRmNjRmYTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYm94aW5hdG9yLWZjZDRjIiwiYXVkIjoiYm94aW5hdG9yLWZjZDRjIiwiYXV0aF90aW1lIjoxNjA4MDQyNzQwLCJ1c2VyX2lkIjoiTGpQcjdXTjJWVGhiZzJ5NTZVSlBabXphWTNnMiIsInN1YiI6IkxqUHI3V04yVlRoYmcyeTU2VUpQWm16YVkzZzIiLCJpYXQiOjE2MTAwMjMyNDksImV4cCI6MTYxMDAyNjg0OSwiZW1haWwiOiJvc2Nhci5kYWhscXVpc3RAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsib3NjYXIuZGFobHF1aXN0QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIiwic2lnbl9pbl9zZWNvbmRfZmFjdG9yIjoicGhvbmUiLCJzZWNvbmRfZmFjdG9yX2lkZW50aWZpZXIiOiI2NjBhNTJiOS0xMWIyLTRiOWQtODRhNi0xZjU1MDBlYTQzMWYifX0.1iG57Vnh8PeZUWewFA8s4Fa-Sm1B7kvLyJE1HxNoc99bUGJUJc-1RiMNOYOhzxai_bOpY8_GA0XdS11Y9qO6S4U-6cbtOdTwMZb_Ma4jdGQlUGZ9S_OB9XnGrwja36LZnXU4tVEDHVVu4H6gPVLdtMbz_W42UTbh9z3bXOXLRIWlux2lxzCfhfsppGhD1wq2QCza-bKqHHfYbGgwnNVt_QnveZA08YJWXNVgC_tDFLpaiafeZ545GW9KYR1UiizFgwilhh84wHSPYEoGCwzheQ5ENlaFvFj4jIV_7MHNFvX70zv0wKiOySNEaZdKcL2FO4ke2K9JVAkU2lmiRe1CIw";


    @Test
    @DisplayName("Testing_Add_Country_With_Country_Wakanda")
    void testingAddCountryWithCountryWakanda() {

        //Given
        Country country = new Country();
        country.setName("Wakanda");
        country.setCountryCode("WKA");
        country.setFeeMultiplier(5);

        //When
        ResponseEntity<CommonResponse> res =  countryController.addCountry(testToken,country);

        //Then
        assertEquals(HttpStatus.CREATED, res.getStatusCode());
        country = (Country)res.getBody().data;
        countryController.deleteCountryById(testToken,country.getId());
    }

    @Test
    @DisplayName("Testing_Get_All_Countries")
    void getAllCountries() {
        
    }

    @Test
    @DisplayName("")
    void updateCountryById() {
    }

    @Test
    @DisplayName("")
    void deleteCountryById() {
    }
}
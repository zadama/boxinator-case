package com.example.boxinator.Controllers;

import com.example.boxinator.FirebaseToken;
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
    7.Paste into the string testToken below after the "Bearer ...". in the class FirebaseToken.
*/

    private final String testToken= FirebaseToken.token;


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

        //Given
        //When
        ResponseEntity<CommonResponse> res = countryController.getAllCountries();
        //Then
        assertEquals(HttpStatus.OK,res.getStatusCode());
    }

    @Test
    @DisplayName("")
    void updateCountryById() {
        //Given

        //When

        //Then
    }

    @Test
    @DisplayName("")
    void deleteCountryById() {
        //Given

        //When

        //Then
    }
}
package com.example.boxinator.Repositories;

import com.example.boxinator.Models.Country;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CountryRepositoryTest {

@Autowired
private CountryRepository countryRepository;

    @Test
    @DisplayName("Testing_Find_By_Name")
    void testFindByName() {
        //Given
        String testCountry ="Sweden";

        //When
        Optional<Country> res =countryRepository.findByName(testCountry);
        //Then
        assertEquals(false,res.isEmpty());
    }
}
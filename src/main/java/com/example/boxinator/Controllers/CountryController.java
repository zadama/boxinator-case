package com.example.boxinator.Controllers;

import com.example.boxinator.Models.Country;
import com.example.boxinator.Repositories.CountryRepository;
import com.example.boxinator.Utils.CommonResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/v1/settings/country")

public class CountryController {

 // GET/countries, POST/countries/:country_id, PUT/countries/country_id

    @Autowired
    CountryRepository countryRepository;

    @PostMapping
    public ResponseEntity<CommonResponse> addCountry(@RequestBody Country countryToAdd){
        CommonResponse commonResponse = new CommonResponse();

        if(countryRepository.equals(countryToAdd.getName())){
            try {
                countryRepository.save(countryToAdd);
                commonResponse.data = countryToAdd;
                commonResponse.msg = "The country " + countryToAdd.getName() + " has been added.";
                commonResponse.status = HttpStatus.CREATED;
            } catch (Exception e) {
                commonResponse.status = HttpStatus.BAD_REQUEST;
            }
        } else {
            commonResponse.msg = "The country " + countryToAdd.getName() + " already exists in the database.";
            commonResponse.status = HttpStatus.CONFLICT;
        }

        return new ResponseEntity<>(commonResponse, commonResponse.status);
    }

    @GetMapping
    public ResponseEntity<CommonResponse> getAllCountries() {
        CommonResponse commonResponse = new CommonResponse();

        try {
            List<Country> countries = countryRepository.findAll();
            commonResponse.data = countries;
            commonResponse.msg = "List of all existing countries in the database.";
            commonResponse.status = HttpStatus.OK;
            } catch (Exception e){
                commonResponse.msg = "Unable to get list of all countries.";
                commonResponse.status = HttpStatus.BAD_REQUEST;

        }

        return new ResponseEntity<>(commonResponse, commonResponse.status);
    }

    @PostMapping(value = "/{country_id}")
    public ResponseEntity<CommonResponse> updateCountryById (
            @RequestBody Country countryToUpdate,
            @PathVariable ("country_id") Long id) {
        CommonResponse commonResponse = new CommonResponse();

        if (countryRepository.existsById(id)) {
            Optional<Country> countryToUpdateRepo = countryRepository.findById(id);
            Country country = countryToUpdateRepo.get();

            if (countryToUpdate.getName() != null) {
                country.setName(countryToUpdate.getName());
            }

            if (countryToUpdate.getFeeMultiplier() != null) {
                country.setFeeMultiplier(countryToUpdate.getFeeMultiplier());
            }

            try {
            countryRepository.save(country);
            commonResponse.data = country;
            commonResponse.msg = "Record of country with id: " + id + " has been updated.";
            commonResponse.status = HttpStatus.OK;

            } catch (Exception e) {
                commonResponse.status = HttpStatus.BAD_REQUEST;
            }

        } else {
            commonResponse.msg = "Record of country with id " + id + " was not found.";
            commonResponse.status = HttpStatus.NOT_FOUND;
        }
        return new ResponseEntity<>(commonResponse, commonResponse.status);
    }
}



package com.example.boxinator.Controllers;

import com.example.boxinator.Models.Country;
import com.example.boxinator.Repositories.CountryRepository;
import com.example.boxinator.Utils.CommonResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/v1/settings/country")

public class CountryController {

 // GET/countries(CHECK), POST/countries/:country_id, PUT/countries/country_id

    @Autowired
    CountryRepository countryRepository;

    @PostMapping("/create")
    public ResponseEntity<CommonResponse> addCountry(@RequestBody Country countryToAdd){
        CommonResponse cr = new CommonResponse();

        try {
            countryRepository.save(countryToAdd);
            cr.data = countryToAdd;
            cr.msg = "The country " + countryToAdd.getName() + " has been added.";
            cr.status = HttpStatus.CREATED;
        } catch(DataIntegrityViolationException e) {
            if (e.getCause().toString().contains("PropertyValueException")) {
                cr.msg = "Some required field might be missing.";
            } else {
                cr.msg = "Some value already exists.";
            }
            cr.status = HttpStatus.BAD_REQUEST;
        } catch (Exception e) {
            cr.msg = "You do not have permission to add a country.";
            cr.status = HttpStatus.UNAUTHORIZED;
        }

        return new ResponseEntity<>(cr, cr.status);
    }

    @GetMapping("/all")
    public ResponseEntity<CommonResponse> getAllCountries() {
        CommonResponse cr = new CommonResponse();

        try {
            cr.data = countryRepository.findAll();
            cr.msg = "List of all existing countries in the database.";
            cr.status = HttpStatus.OK;
        } catch (Exception e){
            cr.msg = "Currently unable to get the list of all countries in the database.";
            cr.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(cr, cr.status);
    }

    @PatchMapping(value = "/{country_id}")
    public ResponseEntity<CommonResponse> updateCountryById (
            @RequestBody Country countryToUpdate,
            @PathVariable ("country_id") Long country_id) {
        CommonResponse cr = new CommonResponse();

        if (countryRepository.existsById(country_id)) {
            Optional<Country> countryToUpdateRepo = countryRepository.findById(country_id);
            Country country = countryToUpdateRepo.orElse(null);

            if (country != null) {
                if (countryToUpdate.getName() != null) {
                    country.setName(countryToUpdate.getName());
                }

                if (countryToUpdate.getCountryCode() != null) {
                    country.setCountryCode(countryToUpdate.getCountryCode());
                }

                if (countryToUpdate.getFeeMultiplier() != 0) {
                    country.setFeeMultiplier(countryToUpdate.getFeeMultiplier());
                }

                try {
                    countryRepository.save(country);
                    cr.data = country;
                    cr.msg = "Record of country with id: " + country_id + " has been updated.";
                    cr.status = HttpStatus.OK;
                } catch (Exception e) {
                    cr.status = HttpStatus.BAD_REQUEST;
                }
            }

        } else {
            cr.msg = "Record of country with id " + country_id + " was not found.";
            cr.status = HttpStatus.NOT_FOUND;
        }
        return new ResponseEntity<>(cr, cr.status);
    }
}



package com.example.boxinator.Controllers;

import com.example.boxinator.Models.Country;
import com.example.boxinator.Repositories.CountryRepository;
import com.example.boxinator.Utils.AuthService.AuthResponse;
import com.example.boxinator.Utils.AuthService.AuthenticationService;
import com.example.boxinator.Utils.CommonResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping(value = "/api/v1/settings/country")

public class CountryController {

 // GET/countries(CHECK), POST/countries/:country_id, PUT/countries/country_id

    @Autowired
    private CountryRepository countryRepository;

    @Autowired
    AuthenticationService authService;

    @PostMapping("/create")
    public ResponseEntity<CommonResponse> addCountry(
            @RequestHeader(value = "Authorization") String token,
            @RequestBody Country countryToAdd
    ) {
        CommonResponse cr = new CommonResponse();
        ResponseEntity<AuthResponse> authResponse = authService.checkToken(token);

        if(authResponse.getStatusCode() == HttpStatus.OK) {
            if(authResponse.getBody().account.getRole().equals("ADMIN")){
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
                    cr.msg = "A country could not be created.";
                    cr.status = HttpStatus.CONFLICT;
                }
            } else {
                cr.msg = "Your role does not have permission to add a country.";
                cr.status = HttpStatus.UNAUTHORIZED;
            }
        } else {
            cr.data = authResponse.getBody().msg;
            cr.msg = "Unauthorized: Invalid token.";
            cr.status = HttpStatus.UNAUTHORIZED;
        }

        return new ResponseEntity<>(cr, cr.status);
    }

    @GetMapping("/all")
    public ResponseEntity<CommonResponse> getAllCountries(){
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
            @RequestHeader(value = "Authorization") String token,
            @RequestBody Country countryToUpdate,
            @PathVariable ("country_id") Long country_id
    ) {
        CommonResponse cr = new CommonResponse();
        ResponseEntity<AuthResponse> authResponse = authService.checkToken(token);

        if (authResponse.getStatusCode() == HttpStatus.OK && authResponse.getBody().account.getRole().equals("ADMIN")) {
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
        } else {
            cr.data = authResponse.getBody().msg;
            cr.msg = "Your role does not have permission to do this.";
            cr.status = HttpStatus.UNAUTHORIZED;
        }
        return new ResponseEntity<>(cr, cr.status);
    }
}



package com.example.boxinator.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AccountController {

    @RequestMapping(method = RequestMethod.GET, value = "/api/greet")
    public void greet (){
        System.out.println("HERE");
    }

}

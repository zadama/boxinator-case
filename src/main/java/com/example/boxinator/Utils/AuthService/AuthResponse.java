package com.example.boxinator.Utils.AuthService;

import com.example.boxinator.Models.Account;
import org.springframework.http.HttpStatus;

public class AuthResponse {
    public Account account;
    public String msg;
    public HttpStatus status;
}

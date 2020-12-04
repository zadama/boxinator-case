package com.example.boxinator.Security;

import com.example.boxinator.Models.Account;
import com.example.boxinator.Repositories.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    AccountRepository accountRepositor;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Account> account = accountRepositor.findByEmail(email);

        account.orElseThrow(()-> new UsernameNotFoundException("Not found " + email));

        return new MyUserDetails(account.get());
    }
}

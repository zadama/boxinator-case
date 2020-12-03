package com.example.boxinator.Security;

import com.example.boxinator.Models.Account;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;

public class MyUserDetails implements UserDetails {
    private String username;
    private String password;
    private boolean active;
    private List<GrantedAuthority> authorities;

    public MyUserDetails(Account account){
        this.username = account.getEmail();
        this.password=account.getPassword();
        this.active = true;
        this.authorities = Arrays.asList(new SimpleGrantedAuthority("ROLE_" +account.getRole()));

    }

    public MyUserDetails(){
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}

package com.example.boxinator.Repositories;

import com.example.boxinator.Models.Country;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CountryRepository extends JpaRepository<Country, Long> {
}

package com.example.boxinator.Models;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;
import java.util.Date;

@Entity
@JsonIdentityInfo(
        generator =
                ObjectIdGenerators.PropertyGenerator.class,
        property = "id"
)

public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // CHANGE THIS // MUCH TEMPORARY

    @Column
    private Date dateOfBirth;

    @Column
    private String country;

    @Column
    private int zipCode;

    @Column
    private long contactNumber;

    @Column
    private String role;

}

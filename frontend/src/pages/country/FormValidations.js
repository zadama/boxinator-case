import React from "react";


export default function validate(values) {
    let errors = {};

    if (!values.name) {
        errors.name = "Name of country is required.";
    } else if (!/^[a-zA-Z]+$/.test(values.name)) {
        errors.name = 'Country name is invalid, please enter letters only.';
    }
    if (!values.countryCode) {
        errors.countryCode = "Country abbreviation is required.";
    } else if (!/^[a-zA-Z]+$/.test(values.countryCode)) {
        errors.countryCode= "Country abbreviation is invalid, please enter letters only.";
    }

    if (!values.feeMultiplier) {
        errors.feeMultiplier = "Fee multiplier is required.";
    } else if (!/^[0-9]/.test(values.feeMultiplier)) {
        errors.feeMultiplier = "Fee multiplier must be a number."
    }
    return errors;
};
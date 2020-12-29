import React from "react";

export default function validate(values) {
    let errors = {};

    if(!values.receiver){
        errors.receiver = "Name of receiver is required.";
    }
    return errors; 
};
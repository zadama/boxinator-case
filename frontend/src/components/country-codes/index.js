import React from "react";
import Select from "react-select";
import countryCodes from "../../utils/countryCodes";

const CountryCodes = ({ value, handleChange }) => {
  return (
    <Select
      className="select-picker country-code"
      placeholder={"Country code"}
      value={value}
      onChange={handleChange}
      options={countryCodes}
    />
  );
};

export default CountryCodes;

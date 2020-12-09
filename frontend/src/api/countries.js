import Axios from "axios";
import Api from "./axios";
import {ADMIN} from "../utils/roles";

const addCountry = (
    name,
    countryCode,
    feeMultiplier,
    token
) => {
      return Api.post("settings/country/create", {
          name,
          countryCode,
          feeMultiplier,
      }, {
          headers: { Authorization: `Bearer ${token}`}
      });
    };

const updateCountryById  = (
    countryId,
    name,
    countryCode,
    feeMultiplier,
    token
) => {
    return Api.patch(`settings/country/${countryId}`, {
        name,
        countryCode,
        feeMultiplier,
    }, {
        headers: {Authorization: `Bearer ${token}`}
    });
};

const getAllCountries = (token) => {
    return Api.get("/settings/country/all",
        {
            headers: {Authorization: `Bearer ${token}`},
        });
};

export { addCountry, getAllCountries, updateCountryById };

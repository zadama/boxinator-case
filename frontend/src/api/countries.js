import Axios from "axios";
import Api from "./axios";

const getAllCountries = (token) => {
  return Api.get("/settings/country");
};

export { getAllCountries };

import Axios from "axios";
import Api from "./axios";

const getAllCountries = () => {
  return Api.get("/settings/country");
};

export { getAllCountries };

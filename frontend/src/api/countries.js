import Api from "./axios";

const getAllCountries = (token) => {
  return Api.get("/settings/country/all");
};

export { getAllCountries };

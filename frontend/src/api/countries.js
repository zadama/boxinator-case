import Api from "./axios";

const addCountry = ({ name, countryCode, feeMultiplier }, token) => {
  return Api.post(
    "settings/country/create",
    {
      name,
      countryCode,
      feeMultiplier,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

const updateCountryById = ({ id, name, countryCode, feeMultiplier }, token) => {
  return Api.patch(
    `settings/country/${id}`,
    {
      name,
      countryCode,
      feeMultiplier,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

const getAllCountries = (token) => {
  return Api.get("/settings/country/all", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const deleteCountryById = (id, token) => {
  return Api.delete(`/settings/country/remove/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export { addCountry, getAllCountries, updateCountryById, deleteCountryById };

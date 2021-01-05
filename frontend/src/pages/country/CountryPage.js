import React, { useEffect, useRef, useState } from "react";
import {
  addCountry,
  deleteCountryById,
  updateCountryById,
} from "../../api/countries";
import { getAllCountries } from "../../api/countries";
import { useAuth } from "../../context/auth";

import AddCountryModal from "./AddCountryModal";
import Toaster from "../../components/toast/Toaster";
import Search from "../../components/search/Search";
import CountryList from "./CountryList";

import "./styles.scss";

const CountryPage = () => {
  const auth = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [toastHeader, setToastHeader] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [toast, setToast] = useState(false);

  const firstUpdate = useRef(true);
  const [searchValue, setSearchValue] = useState("");
  const [countryList, setCountryList] = useState([]);

  const onAddCountryClicked = async (country) => {
    setIsLoading(true);
    try {
      const token = await auth.getUserToken();
      await addCountry(country, token);
      setToastHeader("Success");
      setToastMsg("Country was added successfully.");
      setToast(true);
    } catch (error) {
      console.log(error, "Unable to add new country");
      setToastHeader("Error");
      setToastMsg("Unable to add duplicate country record.");
      setToast(true);
    } finally {
      setIsLoading(false);
      await fetchCountries();
    }
  };

  const onUpdateCountryClicked = async (oldCountry, newCountry) => {
    setIsLoading(true);
    try {
      const token = await auth.getUserToken();

      if (oldCountry.name === newCountry.name) delete newCountry.name;
      if (oldCountry.countryCode === newCountry.countryCode) delete newCountry.countryCode;
      if (oldCountry.feeMultiplier === newCountry.feeMultiplier) delete newCountry.feeMultiplier;

      if (Object.keys(newCountry).length > 1) {      
        await updateCountryById(newCountry, token);
        setToastHeader("Success");
        setToastMsg("Country record was updated successfully.");
        setToast(true);
      } else {
        setToastHeader("Error");
        setToastMsg("No Change to country record was made.");
        setToast(true);
      }
    } catch (error) {
      console.log(error, "Unable to update country details");
      setToastHeader("Error");
      setToastMsg("Unable to update country record details.");
      setToast(true);
    } finally {
      setIsLoading(false);
      await fetchCountries();
    }
  };

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      fetchCountries();
      return;
    } else {
      const filtered = countries.filter((country) => {
        return (
          country.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          country.id + "" === searchValue ||
          country.countryCode.toLowerCase().includes(searchValue.toLowerCase())
        );
      });
      setCountryList(filtered);
    }
  }, [searchValue]);

  const fetchCountries = async () => {
    setIsLoading(true);
    try {
      const token = await auth.getUserToken();
      let response = await getAllCountries(token);
      let { data: savedCountries } = response.data;
      savedCountries = savedCountries
        .sort(function (a, b) {
          return a.id - b.id;
        })
        .map((country) => {
          return {
            id: country.id,
            name: country.name,
            countryCode: country.countryCode,
            feeMultiplier: country.feeMultiplier,
          };
        });
      setCountries(savedCountries);
      setCountryList(savedCountries);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDeleteCountryClicked = async (id) => {
    setIsLoading(true);
    try {
      const token = await auth.getUserToken();
      await deleteCountryById(id, token);
      setToastHeader("Success");
      setToastMsg("Country record was deleted successfully.");
      setToast(true);
    } catch (error) {
      console.log(error, "Unable to delete country with id: " + id);
      setToastHeader("Error");
      setToastMsg("Unable to delete country record.");
      setToast(true);
    } finally {
      setIsLoading(false);
      await fetchCountries();
    }
  };

  return (
    <div>
      {toast && (
        <Toaster
          toastHeaderMsg={toastHeader}
          toastMsg={toastMsg}
          onClose={() => {
            setToast(false);
          }}
        />
      )}
      <div>
        <Search setSearchValue={setSearchValue} />
      </div>

      <div className="all-countries-container">
        <div className="row country-table-header">
          <h3>All Countries</h3>
          <AddCountryModal addCountry={onAddCountryClicked} />
        </div>

        <CountryList
          countryList={countryList}
          updateCountry={onUpdateCountryClicked}
          deleteCountry={onDeleteCountryClicked}
        />
      </div>
    </div>
  );
};

export default CountryPage;

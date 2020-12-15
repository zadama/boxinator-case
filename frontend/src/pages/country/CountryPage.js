import React, {useEffect, useState} from 'react';
import {addCountry, deleteCountryById, updateCountryById} from "../../api/countries";
import {getAllCountries} from "../../api/countries";
import {useAuth} from "../../context/auth";

import "./styles.scss";
import EditModal from "./UpdateCountryModal";
import AddCountryModal from "./AddCountryModal";
import DeleteCountryModal from "./DeleteCountryModal";
import Toaster from "../../components/toast/Toaster";



const CountryPage = () => {
    const auth = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [countries, setCountries] = useState([]);
    const [toastHeader, setToastHeader] = useState("");
    const [toastMsg, setToastMsg] = useState("");
    const [toast, setToast] = useState(false);

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

   const onUpdateCountryClicked = async (country) => {
       console.log(country);
        setIsLoading(true);
        try {
            const token = await auth.getUserToken();
            await updateCountryById(country, token);
            setToastHeader("Success");
            setToastMsg("Country record was updated successfully.");
            setToast(true);
        }catch (error){
            console.log(error, "Unable to update country details");
            setToastHeader("Error");
            setToastMsg("Unable to update country record details.");
            setToast(true);
        }finally {
            setIsLoading(false);
            await fetchCountries();
        }
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
        setIsLoading(true);
        let response = await getAllCountries();
        let {data: savedCountries} = response.data;
        savedCountries = savedCountries
            .sort(function(a,b){
                return a.id - b.id
        }).map((country) => {

            return {
                id: country.id,
                name: country.name,
                countryCode: country.countryCode,
                feeMultiplier: country.feeMultiplier,
            };
        });
        setCountries(savedCountries);
        setIsLoading(false);
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
        }finally {
            setIsLoading(false);
            await fetchCountries();
        }
    }

    const countryObjects = countries.map((country) =>
        <tr key={country.id}>
            <td>{country.id}</td>
            <td>{country.name}</td>
            <td>{country.countryCode}</td>
            <td>{country.feeMultiplier}</td>
            <td>
                <div className="row">
                    <EditModal country={country} updateCountry={onUpdateCountryClicked}/>
                    <DeleteCountryModal country={country} deleteCountry={onDeleteCountryClicked}/>
                </div>

            </td>
        </tr>
    );

    return(
        <div>
            <h1>Shipping Countries</h1>
            {toast && <Toaster toastHeaderMsg={toastHeader} toastMsg={toastMsg} onClose={() => {
                setToast(false);
            }}/>}
            <div className="search-container">
                <button onClick={fetchCountries} className="btn btn-info" type="button">Get all countries</button>
            </div>

            <div className="all-countries-container">
                <div className="row country-table-header">
                    <h3>All Countries</h3>
                    <AddCountryModal addCountry={onAddCountryClicked}/>
                </div>

                <table className="table table-bordered">
                    <thead className="thead-light">
                    <tr>
                        <th scope="col">Country Id</th>
                        <th scope="col">Country Name</th>
                        <th scope="col">Country Abbreviation</th>
                        <th scope="col">Fee Multiplier</th>
                        <th scope="col">Edit Details</th>
                    </tr>
                    </thead>
                    <tbody>
                        {countryObjects}
                    </tbody>
                </table>

            </div>
        </div>
    );
};

export default CountryPage;
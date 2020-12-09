import React, {useEffect, useState} from 'react';
import {addCountry, updateCountryById} from "../../api/countries";
import {getAllCountries} from "../../api/countries";
import {useAuth} from "../../context/auth";

import "./styles.scss";


const CountryPage = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [countryName, setCountryName] = useState("");
    const [countryCode, setCountryCode] = useState("");
    const [feeMultiplier, setFeeMultiplier] = useState(0);
    const [countries, setCountries] = useState([]);

    const auth = useAuth();


    const onAddCountryClicked = async () => {
        setIsLoading(true);
        let result;
        try {
            const token = await auth.getUserToken();
            result = await addCountry(countryName,countryCode, feeMultiplier, token);
        } catch (error) {
            console.log(error, "Unable to add new country");
        } finally {
            setIsLoading(false);
            console.log(result);
        }
    };

    const onUpdateCountryClicked = async () => {
        setIsLoading(true);
        let result;
        try {
            const token = await auth.getUserToken();
            result = await updateCountryById(countryName, countryCode, feeMultiplier);
        }catch (error){
            console.log(error, "Unable to update country details");
        }finally {
            setIsLoading(false);
            console.log(result);
        }
    }

    useEffect( () => {
        const fetchCountries = async () => {
            setIsLoading(true);
            let response = await getAllCountries();
            let {data: savedCountries} = response.data;

            savedCountries = savedCountries.map((country) => {

                return {
                    countryId: country.countryId,
                    countryName: country.name,
                    countryCode: country.countryCode,
                    feeMultiplier: country.feeMultiplier,
                };
            });
            setCountries(savedCountries);
            setIsLoading(false);
            console.log(savedCountries);
        };
        fetchCountries();
    }, []);

    //button handle click
    //loading || result
    const onCountryNameChanged = event => setCountryName(event.target.value.trim());
    const onCountryCodeChanged = event => setCountryCode(event.target.value.trim());
    const onFeeMultiplierChanged = event => setFeeMultiplier(event.target.value.trim());

    return(
        <div>
            <h1>Shipping Countries</h1>
            <div>


                <div className="addCountryForm">
                    <form>
                        <div className="form-group">
                            <label htmlFor="countryName">Country name: </label>
                            <input type="text" className="form-control"
                                   placeholder="country name" id="countryName" onChange={onCountryNameChanged}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="countryCode">Country code: </label>
                            <input type="text" className="form-control"
                                   placeholder="country code" id="countryCode" onChange={onCountryCodeChanged}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="feeMultiplier">Fee Multiplier: </label>
                            <input type="text" className="form-control"
                                   placeholder="feeMultiplier" id="feeMultiplier" onChange={onFeeMultiplierChanged}/>
                        </div>
                        <button onClick={onAddCountryClicked} className="btn btn-info"> Add country </button>
                    </form>
                </div>
            </div>

            <button onClick={getAllCountries} className="btn btn-info">Get all countries</button>

            <div className="allCountriesTable">
                <h3>All Countries</h3>
                <table className="table table-bordered">
                    <thead className="thead-light">
                    <tr>
                        <th scope="col">Country Id</th>
                        <th scope="col">Country Name</th>
                        <th scope="col">Country Code</th>
                        <th scope="col">Fee Multiplier</th>
                    </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
    );


};

export default CountryPage;
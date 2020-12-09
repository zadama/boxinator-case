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
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
        setIsLoading(true);
        let response = await getAllCountries();
        let {data: savedCountries} = response.data;

        savedCountries = savedCountries.map((country) => {

            return {
                countryId: country.id,
                countryName: country.name,
                countryCode: country.countryCode,
                feeMultiplier: country.feeMultiplier,
            };
        });
        setCountries(savedCountries);
        setIsLoading(false);
        console.log(savedCountries);
    };

    const countryObjects = countries.map((entry, index) =>
        <tr key={index}>
            <td>{entry.countryId}</td>
            <td>{entry.countryName}</td>
            <td>{entry.countryCode}</td>
            <td>{entry.feeMultiplier}</td>
            <td>
                <button className="btn btn-info btn-sm mt-0">Edit</button>
            </td>
        </tr>
    );

    //button handle click
    //loading || result
    const onCountryNameChanged = event => setCountryName(event.target.value.trim());
    const onCountryCodeChanged = event => setCountryCode(event.target.value.trim());
    const onFeeMultiplierChanged = event => setFeeMultiplier(event.target.value.trim());

    return(
        <div>
            <h1>Shipping Countries</h1>

                <div className="addCountryForm">
                    <form>
                        <div className="form-group">
                            <label htmlFor="countryName">Country name: </label>
                            <input type="text" className="form-control"
                                   placeholder="Country Name" id="countryName" onChange={onCountryNameChanged}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="countryCode">Country code: </label>
                            <input type="text" className="form-control"
                                   placeholder="Country Code" id="countryCode" onChange={onCountryCodeChanged}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="feeMultiplier">Fee Multiplier: </label>
                            <input type="text" className="form-control"
                                   placeholder="Fee Multiplier" id="feeMultiplier" onChange={onFeeMultiplierChanged}/>
                        </div>
                        <button onClick={onAddCountryClicked} className="btn btn-info" type="button"> Add country </button>
                    </form>
                </div>
                <button onClick={fetchCountries} className="btn btn-info" type="button">Get all countries</button>


            <div className="allCountriesTable">
                <div className="row">
                    <h3>All Countries</h3>
                    <button onClick={onAddCountryClicked} className="btn btn-info btn-sm mt-0" type="submit"> Add country </button>
                </div>

                <table className="table table-bordered">
                    <thead className="thead-light">
                    <tr>
                        <th scope="col">Country Id</th>
                        <th scope="col">Country Name</th>
                        <th scope="col">Country Code</th>
                        <th scope="col">Fee Multiplier</th>
                        <th scope="col">Edit</th>
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
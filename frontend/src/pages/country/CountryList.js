import React from 'react';
import UpdateCountryModal from "./UpdateCountryModal";
import DeleteCountryModal from "./DeleteCountryModal";


import "./styles.scss";

const CountryList = ({countryList=[]}) => {

    const countryObjects = countryList.map((country, index) => {
            if (country) {
                return (
                    <tr key={country.id}>
                        <td>{country.id}</td>
                        <td>{country.name}</td>
                        <td>{country.countryCode}</td>
                        <td>{country.feeMultiplier}</td>
                        <td>
                            <div className="row">
                                <UpdateCountryModal country={country}/>
                                <DeleteCountryModal country={country}/>
                            </div>

                        </td>
                    </tr>
                )
            }else {
                return (
                    <tr>
                        <p>No record was found.</p>
                    </tr>
                )
            }
    });

    return (
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
                { countryList.length > 0
                    ? countryObjects
                        :<tr>
                            <td>No record was found.</td>
                        </tr>
                }
                </tbody>
            </table>
    );
};

export default CountryList;
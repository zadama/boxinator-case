import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { getAllAccounts, updateAccount, deleteAccount } from '../../api/user';
import DatePicker from 'react-datepicker';
import { parseISO } from 'date-fns';

import "./style.scss";

import { useAuth } from "../../context/auth";
import { getAllCountries } from '../../api/countries';


const UserDetails = () => {
    const auth = useAuth();
    const [data, setData] = useState(null);
    const [countries, setCountries] = useState([]);
    const [dateOfBirth, setDateOfBirth] = useState(new Date()); 
    const [editUserView, setEditUserView] = useState(false);
    const [thisUser, setThisUser] = useState(null);
    const [editedUser, setEditedUser] = useState({});

    const renderUserDataWithAdminToken = async () => {
        try {
            const token = await auth.getUserToken();

            const { data } = await getAllAccounts(token); 
            
            let { data: savedCountries } = await getAllCountries();

            savedCountries = savedCountries.data.map((country) => {
                return {
                    name: country.name, 
                    code: country.countryCode,
                    feeMulti: country.feeMultiplier
                };
            });

            setCountries(savedCountries);
            setData(data);
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        renderUserDataWithAdminToken();
    }, [])

    const handleEditClick = (user) => {
        console.log("EDITING");
        !user.dateOfBirth ? setDateOfBirth(new Date()) : setDateOfBirth(parseISO(user.dateOfBirth));
        setEditUserView(!editUserView);
        setThisUser(user);
        setEditedUser();
    }

    const handleDeleteClick = async (user) => {
        let confirm = prompt("Are you sure you want to delete the account with id: "
        +user.id+"?\nProvide this phrase to confirm delete: "+user.email, "");

        if (confirm !== user.email) {
            alert("Incorrect confirmation credentials provided. Try again.");
        } else {
            try {
                const token = await auth.getUserToken();

                await deleteAccount(token, user.id); // NOT WORKING (object is not a function??)

            } catch (error) {
                console.log(error);
            }
            console.log("DELETE"); // DELETE FROM FIREBASE AND SEND API REQUEST
        }
    }

    const updateField = (input, id) => { // ADD VALIDATION TO EACH INPUT
        if (id === "firstName") {
            setEditedUser(prevState => ({...prevState, firstName: input}))
        }
        
        if (id === "lastName") {
            setEditedUser(prevState => ({...prevState, lastName: input}))
        }

        if (id === "email") {
            setEditedUser(prevState => ({...prevState, email: input}))
        }

        if (id === "dateOfBirth") {
            setDateOfBirth(input);
            setEditedUser(prevState => ({...prevState, dateOfBirth: input}))
        }

        if (id === "zipCode") {
            setEditedUser(prevState => ({...prevState, zipCode: input}))
        }

        if (id === "country") {
            setEditedUser(prevState => ({...prevState, country: JSON.parse(input)}))
        }

        if (id === "contactNumber") {
            setEditedUser(prevState => ({...prevState, contactNumber: input}))
        }

        if (id === "role") {
            setEditedUser(prevState => ({...prevState, role: input}))
        }
        
    }

    const handleSaveEditedUser = async () => {
        console.log("SAVED");
        try {
            const token = await auth.getUserToken();

            await updateAccount(token, thisUser.id, editedUser);// EDIT FIREBASE USER AND SEND API REQUEST
            renderUserDataWithAdminToken();
        } catch (error) {
            console.log(error);
        } finally {
            setEditedUser([]);
            setEditUserView(!editUserView);
        }
        
    }

    const handleCancelEditUserView = () => {
        console.log("CANCELLED");
        setEditedUser([]);
        setEditUserView(!editUserView);
    }

    return (
        <>
        {!data ? (
            <div>loading...</div>
        ) : (
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Date of Birth</th>
                        <th>Zipcode</th>
                        <th>Country of residence</th>
                        <th>Contact number</th>
                        <th>Role</th>
                        <th>Shipments</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {data.data.map(function(user){
                            return <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.firstName} {user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{!user.dateOfBirth ? "Not defined" : user.dateOfBirth}</td>
                                <td>{!user.zipCode ? "Not defined" : user.zipCode}</td>
                                <td>{!user.country ? "Not defined" : user.country}</td>
                                <td>{!user.contactNumber ? "Not defined" : user.contactNumber}</td>
                                <td>{user.role}</td>
                                <td className="shipments">{user.shipments}</td>
                                <td className="btns">
                                    <button className="btns" onClick={() => handleEditClick(user)}>Edit </button>
                                    <button className="btns" onClick={() => handleDeleteClick(user)}> Delete</button>
                                </td>
                            </tr>
                    })}
                </tbody> 
            </Table>
        )}
        {!editUserView ? "" : <div className="edit-user-view">
                <h1>{thisUser.firstName} {thisUser.lastName}</h1>
                <div className="dual-inputs">
                    <div>
                        <label>Firstname: </label><br/>
                        <input 
                        type="text" 
                        id="firstName"
                        defaultValue={thisUser.firstName}
                        onChange={(event) => updateField(event.target.value, event.target.id)}></input>
                    </div>
                    <div>
                        <label>Lastname: </label><br/>
                        <input 
                        type="text" 
                        id="lastName"
                        defaultValue={thisUser.lastName}
                        onChange={(event) => updateField(event.target.value, event.target.id)}></input>
                    </div>
                </div>
                <div className="dual-inputs">
                    <div>
                        <label>Email: </label><br/>
                        <input 
                        type="text"
                        id="email"
                        defaultValue={thisUser.email}
                        onChange={(event) => updateField(event.target.value, event.target.id)}></input>
                    </div>
                    <div>
                        <label>Date of birth: </label><br/>
                        
                        <DatePicker
                            selected={dateOfBirth}
                            showYearDropdown
                            maxDate={new Date()}
                            placeholderText="MM/DD/YYYY"
                            onChange={(value) => updateField(value, "dateOfBirth")}
                            className="date-picker"
                        />
                    </div>
                </div>
                <div className="dual-inputs">
                    <div>
                        <label>Zip Code: </label><br/>
                        <input 
                        type="text" 
                        id="zipCode"
                        defaultValue={thisUser.zipCode}
                        onChange={(event) => updateField(event.target.value, event.target.id)}></input>
                    </div>
                    <div>
                        <label>Country: </label><br/>
                        <select
                            placeholder={thisUser.country}
                            options={countries}
                            id="country"
                            onChange={(event) => {
                            updateField(event.target.value, event.target.id);
                            }}
                        >
                            {!countries ? "loading..." :
                            countries.map((country, index) => {
                                return <option key={index} value={JSON.stringify(country)}>{country.name}</option>
                            })}
                        </select>
                    </div>
                </div>

                <div className="dual-inputs">
                    <div>
                        <label>Contact Number: </label><br/>
                        <input 
                        type="text"
                        id="contactNumber"
                        defaultValue={thisUser.contactNumber}
                        onChange={(event) => updateField(event.target.value, event.target.id)}></input>
                    </div>
                    <div>
                        <label>Role: </label><br/>
                        <input 
                        type="text"
                        id="role"
                        defaultValue={thisUser.role}
                        onChange={(event) => updateField(event.target.value, event.target.id)}></input>
                    </div>
                </div>

            <button onClick={handleSaveEditedUser}>Save</button>
            <button onClick={handleCancelEditUserView}>Cancel</button>
        </div>}
    </>
    )

}

export default UserDetails;
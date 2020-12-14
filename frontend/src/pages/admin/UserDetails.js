import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { parseISO } from 'date-fns';
import Modal from '../../components/modal/index';

import "./style.scss";

import { useAuth } from "../../context/auth";
import { getAllCountries } from '../../api/countries';
import { getAllAccounts, updateAccount, deleteAccount } from '../../api/user';
import { ADMIN, USER } from '../../utils/roles';


const UserDetails = () => {
    const auth = useAuth();
    const [data, setData] = useState(null);
    const [countries, setCountries] = useState([]);
    const [dateOfBirth, setDateOfBirth] = useState(new Date()); 
    const [editUserView, setEditUserView] = useState(false);
    const [thisUser, setThisUser] = useState(null);
    const [editedUser, setEditedUser] = useState({});
    const [invalidInput, setInvalidInput] = useState(false);

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

    const handleEditClick = (user) => { // Called when an admin starts to edit an account
        !user.dateOfBirth ? setDateOfBirth(new Date()) : setDateOfBirth(parseISO(user.dateOfBirth)); // If user does not have a chosen DoB, set a temporary one
        setEditUserView(!editUserView);
        setThisUser(user);
        setEditedUser();
    }

    const handleDeleteClick = async (user) => { // Open modal when admin wants to delete account
        let confirm = prompt("Are you sure you want to delete the account with id: "
        +user.id+"?\nProvide this phrase to confirm delete: "+user.email, "");

        if (confirm !== user.email) {
            alert("Incorrect confirmation credentials provided. Try again.");
        } else {
            try {
                const token = await auth.getUserToken(); // Get sessiontoken

                await deleteAccount(token, user.id); // Pass token and pathvariable

            } catch (error) {
                console.log(error);
            }
        }
    }

    const updateField = (input, id) => { // ADD VALIDATION TO EACH INPUT, logic is currently messed up
        let regex = "";
        if (id === "firstName") {
            regex = /^[A-Za-z]+$/;
            if (input.match(regex)) {
                setInvalidInput(false);
                setEditedUser(prevState => ({...prevState, firstName: input}))
            } else {
                setInvalidInput(true);
            }
        }
        
        if (id === "lastName") {
            regex = /^[A-Za-z]+$/;
            if (input.match(regex)) {
                setInvalidInput(false);
                setEditedUser(prevState => ({...prevState, lastName: input}))
            } else {
                setInvalidInput(true);
            }
        }

        if (id === "email") {
            regex = /\S+@\S+\.\S+/;
            if (input.match(regex)) {
                setInvalidInput(false);
                setEditedUser(prevState => ({...prevState, email: input}))
            } else {
                setInvalidInput(true);
            }
            
        }

        if (id === "dateOfBirth") {
            setDateOfBirth(input);
            setEditedUser(prevState => ({...prevState, dateOfBirth: input}))
        }

        if (id === "zipCode") {
            regex = /^[0-9]/;
            if (input.match(regex)) {
                setInvalidInput(false);
                setEditedUser(prevState => ({...prevState, zipCode: input}))
            } else {
                setInvalidInput(true);
            }
        }

        if (id === "country") {
            setEditedUser(prevState => ({...prevState, country: JSON.parse(input)}))
        }

        if (id === "contactNumber") {
            regex = /^[0-9]/;
            if (input.match(regex)) {
                setInvalidInput(false);
                setEditedUser(prevState => ({...prevState, contactNumber: input}))
            } else {
                setInvalidInput(true);
            }
        }
        if (id === "role") {
            console.log(input);
            setEditedUser(prevState => ({...prevState, role: input}))
        }

        
    }

    const handleSaveEditedUser = async () => { // Called when an admin saves changes to an account
        try {
            const token = await auth.getUserToken(); // Get sessiontoken

            await updateAccount(token, thisUser.id, editedUser); // Pass token, pathvariable and body with request
            renderUserDataWithAdminToken(); // Rerender page
        } catch (error) {
            console.log(error);
        } finally {
            setEditedUser([]); // No matter what, editedUser object is reset and popup closed
            setEditUserView(!editUserView);
        }
        
    }

    const handleCancelEditUserView = () => { // Called if the admin cancels editing an account
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
        {!editUserView ? "" : <Modal isVisible={editUserView} onClose={handleCancelEditUserView}>
                <h1>{thisUser.firstName} {thisUser.lastName}</h1>
                
                    <div>
                        <label>Firstname: </label>
                        <input 
                        type="text" 
                        id="firstName"
                        defaultValue={thisUser.firstName}
                        onChange={(event) => updateField(event.target.value, event.target.id)}></input>
                    </div>
                    <div>
                        <label>Lastname: </label>
                        <input 
                        type="text" 
                        id="lastName"
                        defaultValue={thisUser.lastName}
                        onChange={(event) => updateField(event.target.value, event.target.id)}></input>
                    </div>
                    <div>
                        <label>Email: </label>
                        <input 
                        type="text"
                        id="email"
                        defaultValue={thisUser.email}
                        onChange={(event) => updateField(event.target.value, event.target.id)}></input>
                    </div>
                    <div>
                        <label>Date of birth: </label>
                        <DatePicker
                            selected={dateOfBirth}
                            showYearDropdown
                            maxDate={new Date()}
                            placeholderText="MM/DD/YYYY"
                            onChange={(value) => updateField(value, "dateOfBirth")}
                            className="date-picker"
                        />
                    </div>
                    <div>
                        <label>Zip Code: </label>
                        <input 
                        type="text" 
                        id="zipCode"
                        maxLength="6"
                        defaultValue={thisUser.zipCode}
                        onChange={(event) => updateField(event.target.value, event.target.id)}></input>
                    </div>
                    <div>
                        <label>Country: </label>
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
                    <div>
                        <label>Contact Number: </label>
                        <input 
                        type="text"
                        id="contactNumber"
                        maxLength="20"
                        defaultValue={thisUser.contactNumber}
                        onChange={(event) => updateField(event.target.value, event.target.id)}></input>
                    </div>
                    <div>
                        <label>Role: </label>
                        <select
                        placeholder={thisUser.role}
                        id="role"
                        onChange={(event) => updateField(event.target.value, event.target.id)}>
                            <option value={USER}>USER</option>
                            <option value={ADMIN}>ADMIN</option>
                        </select>
                    </div>

            <button disabled={invalidInput ? true : false} onClick={handleSaveEditedUser}>Save</button>
            <button onClick={handleCancelEditUserView}>Cancel</button>
        </Modal>}
    </>
    )

}

export default UserDetails;
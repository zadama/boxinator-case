import React, { useState, useEffect } from 'react';
import Modal from '../../../components/modal/index';
import { parseISO } from 'date-fns';

import "./../style.scss";

import { useAuth } from "../../../context/auth";
import { ADMIN, USER } from '../../../utils/roles';
import { updateAccount } from '../../../api/user';
import DatePicker from 'react-datepicker';

const EditUserModal = (props) => {

    const auth = useAuth();
    const [showModal, setShowModal] = useState(true);

    const [dateOfBirth, setDateOfBirth] = useState(new Date()); 
    const [editedUser, setEditedUser] = useState({});
    const [invalidInput, setInvalidInput] = useState(false);

    useEffect(() => {
        !props.thisUser.dateOfBirth ? setDateOfBirth(new Date()) : setDateOfBirth(parseISO(props.thisUser.dateOfBirth)); // If user does not have a chosen DoB, set a temporary one
    }, [])

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

            await updateAccount(token, props.thisUser.id, editedUser); // Pass token, pathvariable and body with request
            props.reRender(); // Rerender page
        } catch (error) {
            console.log(error);
        } finally {
            setEditedUser([]); // No matter what, editedUser object is reset and popup closed
            setShowModal(!showModal);
        }
        
    }

    const onClose = () => {
        setShowModal(!showModal);
    }

    return (
        <>
            <Modal isVisible={showModal} onClose={onClose}>
                <h1>{props.thisUser.firstName} {props.thisUser.lastName}</h1>
                
                    <div>
                        <label>Firstname: </label>
                        <input 
                        type="text" 
                        id="firstName"
                        defaultValue={props.thisUser.firstName}
                        onChange={(event) => updateField(event.target.value, event.target.id)}></input>
                    </div>
                    <div>
                        <label>Lastname: </label>
                        <input 
                        type="text" 
                        id="lastName"
                        defaultValue={props.thisUser.lastName}
                        onChange={(event) => updateField(event.target.value, event.target.id)}></input>
                    </div>
                    <div>
                        <label>Email: </label>
                        <input 
                        type="text"
                        id="email"
                        defaultValue={props.thisUser.email}
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
                        defaultValue={props.thisUser.zipCode}
                        onChange={(event) => updateField(event.target.value, event.target.id)}></input>
                    </div>
                    <div>
                        <label>Country: </label>
                        <select
                            placeholder={props.thisUser.country}
                            options={props.countries}
                            id="country"
                            onChange={(event) => {
                            updateField(event.target.value, event.target.id);
                            }}
                        >
                            {!props.countries ? "loading..." :
                            props.countries.map((country, index) => {
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
                        defaultValue={props.thisUser.contactNumber}
                        onChange={(event) => updateField(event.target.value, event.target.id)}></input>
                    </div>
                    <div>
                        <label>Role: </label>
                        <select
                        placeholder={props.thisUser.role}
                        id="role"
                        onChange={(event) => updateField(event.target.value, event.target.id)}>
                            <option value={USER}>USER</option>
                            <option value={ADMIN}>ADMIN</option>
                        </select>
                    </div>

                <button disabled={invalidInput ? true : false} onClick={handleSaveEditedUser}>Save</button>
                <button onClick={onClose}>Cancel</button>
            </Modal>
        </>
    )
} 

export default EditUserModal;
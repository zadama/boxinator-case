import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Modal from '../../../components/modal/index';
import { parseISO } from 'date-fns';

import "./../style.scss";

import { useAuth } from "../../../context/auth";
import { ADMIN, USER } from '../../../utils/roles';
import { updateAccount } from '../../../api/user';
import DatePicker from 'react-datepicker';

import "react-datepicker/dist/react-datepicker.css";


const EditUserModal = (props) => {

    const auth = useAuth();
    const { register, handleSubmit, errors, control, watch } = useForm();
    const [showModal, setShowModal] = useState(true);
    const [dob, setDOB] = useState(new Date());

    const { dateOfBirth } = watch(["dateOfBirth"])

    

    useEffect(() => {
        !props.thisUser.dateOfBirth ? setDOB(new Date()) : setDOB(parseISO(props.thisUser.dateOfBirth)); // If user does not have a chosen DoB, set a temporary one
    }, [])

    const onSubmit = data => {
        
        if (props.thisUser.firstName === data.firstName) {
            delete data.firstName;
        }
        
        if (props.thisUser.lastName === data.lastName) {
            delete data.lastName;
        }

        if (props.thisUser.email === data.email) {
            delete data.email;
        }

        if (props.thisUser.zipCode === parseInt(data.zipCode)) {
            delete data.zipCode;
        }

        if (props.thisUser.contactNumber === parseInt(data.contactNumber)) {
            delete data.contactNumber;
        }

        if (props.thisUser.country === JSON.parse(data.country).name) {
            delete data.country;
        }

        if (parseISO(props.thisUser.dateOfBirth) === data.dateOfBirth) {
            delete data.dateOfBirth;
        }

        if (props.thisUser.role === data.role) {
            delete data.role;
        }

        handleSaveEditedUser(data);
        
    };


    const handleSaveEditedUser = async (user) => { // Called when an admin saves changes to an account
        try {
            const token = await auth.getUserToken(); // Get sessiontoken

            await updateAccount(token, props.thisUser.id, user); // Pass token, pathvariable and body with request
            props.reRender(); // Rerender page
            props.toggleToast("saved");
        } catch (error) {
            console.log(error);
        } finally { // popup closed
            setShowModal(!showModal);
        }
    }

    const onClose = () => {
        setShowModal(!showModal);
        props.onClose();
    }

    return (
        <>
            <Modal isVisible={showModal} onClose={onClose}>
                <h1>{props.thisUser.firstName} {props.thisUser.lastName}</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        name="firstName"
                        defaultValue={props.thisUser.firstName} 
                        ref={register({
                            pattern: {
                                value: /^[A-Za-z]+$/,
                                message: "invalid format"
                            }
                        })}>
                    </input>
                    {errors.firstName?.message && <p>{errors.firstName.message}</p>}
                    <input 
                        type="text" 
                        name="lastName" 
                        defaultValue={props.thisUser.lastName} 
                        ref={register({
                            pattern: {
                                value: /^[A-Za-z]+$/,
                                message: "invalid format"
                            }
                        })}>
                    </input>
                    <input 
                        type="text" 
                        name="email" 
                        defaultValue={props.thisUser.email} 
                        ref={register({
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                name: "invalid format"
                            }
                        })}>
                    </input>
                    <Controller as={
                            <DatePicker
                                id="dateOfBirth"
                                showYearDropdown
                                dateFormat="dd/MM/yyyy"
                                maxDate={new Date()}
                                placeholderText="MM/DD/YYYY"
                                onChange={(date) => setDOB(date)}
                                selected={dateOfBirth}
                                autoComplete="off"
                            />
                    }
                        name="dateOfBirth"
                        control={control}
                        valueName="selected"
                        defaultValue={dob}
                    />
                    <input 
                        type="text" 
                        name="zipCode"
                        defaultValue={props.thisUser.zipCode}
                        ref={register}>
                    </input>
                    <select
                        placeholder={props.thisUser.country}
                        options={props.countries}
                        ref={register}
                        name="country"
                    >
                        {!props.thisUser.country && <option value={props.thisUser.country}>Select country...</option>}
                        {!props.countries ? "loading..." :
                        props.countries.map((country, index) => {
                            return <option key={index} value={JSON.stringify(country)}>{country.name}</option>
                        })}
                    </select>
                    <input 
                        type="text"
                        name="contactNumber"
                        defaultValue={props.thisUser.contactNumber}
                        ref={register}>
                    </input>
                    <select
                        placeholder={props.thisUser.role}
                        name="role"
                        ref={register}>
                            <option value={USER}>USER</option>
                            <option value={ADMIN}>ADMIN</option>
                    </select>
                
                    <input type="submit" className="btn btn-primary" value="Save" />
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                </form>
            </Modal>
        </>
    )
} 

export default EditUserModal;
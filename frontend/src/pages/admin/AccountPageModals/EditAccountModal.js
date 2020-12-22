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


const EditAccountModal = (props) => {

    const auth = useAuth();
    const { register, handleSubmit, errors, control, watch, reset } = useForm();
    const [showModal, setShowModal] = useState(true);
    const [dob, setDOB] = useState(new Date());

    const { dateOfBirth } = watch(["dateOfBirth"]);

    

    useEffect(() => {
        !props.thisAccount.dateOfBirth ? setDOB(new Date()) : setDOB(parseISO(props.thisAccount.dateOfBirth)); // If user does not have a chosen DoB, set a temporary one
        reset({...props.thisAccount})
    }, [reset])

    const onSubmit = data => {
        
        if (props.thisAccount.firstName === data.firstName) {
            delete data.firstName;
        }
        
        if (props.thisAccount.lastName === data.lastName) {
            delete data.lastName;
        }

        if (props.thisAccount.email === data.email) {
            delete data.email;
        }

        if (props.thisAccount.zipCode === parseInt(data.zipCode)) {
            delete data.zipCode;
        }

        if (props.thisAccount.contactNumber === parseInt(data.contactNumber)) {
            delete data.contactNumber;
        }

        if (props.thisAccount.country === JSON.parse(data.country).name) {
            delete data.country;
        } 

        if (parseISO(props.thisAccount.dateOfBirth) === data.dateOfBirth) {
            delete data.dateOfBirth;
        }

        if (props.thisAccount.role === data.role) {
            delete data.role;
        }

        handleSaveEditedUser(data);
        
    };


    const handleSaveEditedUser = async (user) => { // Called when an admin saves changes to an account
        try {
            const token = await auth.getUserToken(); // Get sessiontoken

            await updateAccount(token, props.thisAccount.id, user); // Pass token, pathvariable and body with request
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
                <h1>{props.thisAccount.firstName} {props.thisAccount.lastName}</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        name="firstName"
                        defaultValue={props.thisAccount.firstName} 
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
                        defaultValue={props.thisAccount.lastName} 
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
                        defaultValue={props.thisAccount.email} 
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
                                selected={dob}
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
                        defaultValue={props.thisAccount.zipCode}
                        ref={register}>
                    </input>
                    <select
                        ref={register}
                        name="country"
                    >
                        {!props.thisAccount.country && <option value={props.thisAccount.country}>Select country...</option>}
                        {!props.countries ? "loading..." :
                        props.countries.map((country, index) => {
                            return <option key={index} value={JSON.stringify(country)}>{country.name}</option>
                        })}
                    </select>
                    <input 
                        type="text"
                        name="contactNumber"
                        defaultValue={props.thisAccount.contactNumber}
                        ref={register}>
                    </input>
                    <select
                        placeholder={props.thisAccount.role}
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

export default EditAccountModal;
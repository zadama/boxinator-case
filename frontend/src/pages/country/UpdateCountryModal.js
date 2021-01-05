import Modal from "../../components/modal";
import React, {useEffect} from "react";
import useForm from "./useForm";
import validate from "./FormValidations";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilAlt} from "@fortawesome/free-solid-svg-icons";

const { useState } = require("react");

const UpdateCountryModal = (props) => {

    const [showModal, setShowModal] = useState(false);
    const [thisCountry, setThisCountry] = useState(props.country);
    const [id, setId] = useState(props.country.id);


    const updateCountry = () => {
        props.updateCountry(thisCountry, {id, ...values});
        setShowModal(false);
    };

    const {values, setValues, setErrors, errors, handleChange, handleSubmit} = useForm(updateCountry, validate);

    useEffect (() => {
        setThisCountry(props.country);
        setValues(props.country);
    }, [props.country])


    const onClose = () => {
        setValues(props.country);
        setErrors({});
        setShowModal(false);
    };

    return (
        <div className="edit-country-modal">
            <button onClick={() => {
                setShowModal(true);
            }} className="btn btn-info btn-sm ml-2 mt-0">
                <FontAwesomeIcon icon={faPencilAlt} />
            </button>

            {showModal && (<Modal onClose={onClose}>

                <div className="edit-country-form">
                    <form
                        onSubmit={handleSubmit}
                        className="needs-validation"
                        noValidate>
                        <div className="form-group">
                            <label htmlFor="countryName">
                                <strong>Country name:</strong>
                            </label>
                            <input  type="text"
                                    className={`form-control ${errors.name && "is-invalid"}`}
                                    value={values.name || ""}
                                    id="countryName"
                                    name="name"
                                    onChange={handleChange}
                                    required/>
                            {errors.name && (<p className="is-invalid invalid-feedback">
                                {errors.name}</p>)}
                        </div>
                        <div className="form-group">
                            <label htmlFor="countryCode">
                                <strong>Country Abbreviation:</strong>
                            </label>
                            <input  type="text"
                                    className={`form-control ${errors.countryCode && "is-invalid"}`}
                                    value={values.countryCode || ""}
                                    id="countryCode"
                                    name="countryCode"
                                    onChange={handleChange}
                                    required/>
                            {errors.countryCode && (<p className="is-invalid invalid-feedback">
                                {errors.countryCode}</p>)}
                        </div>
                        <div className="form-group">
                            <label htmlFor="feeMultiplier">
                                <strong>Fee multiplier:</strong>
                            </label>
                            <input  type="text"
                                    className={`form-control ${errors.feeMultiplier && "is-invalid"}`}
                                    value={values.feeMultiplier || ""}
                                    id="feeMultiplier"
                                    name="feeMultiplier"
                                    onChange={handleChange}
                                    required/>
                            {errors.feeMultiplier && (<p className="is-invalid invalid-feedback">
                                {errors.feeMultiplier}</p>)}
                        </div>
                        <button type="submit" className="btn btn-info">Save</button>
                        <button onClick={onClose} className="btn btn-danger">Cancel</button>
                    </form>

                </div>

            </Modal>)}
        </div>
    );
};

export default UpdateCountryModal;
import Modal from "../../components/modal";
import React from "react";
import useForm from "./useForm";
import validate from "./FormValidations";

import "./styles.scss";

const { useState } = require("react");

const AddCountryModal = (props) => {

    const [showModal, setShowModal] = useState(false);

    const {values, errors, handleChange, handleSubmit} = useForm(addCountry, validate);

    function addCountry() {
        props.addCountry(values);
        setShowModal(false);
    }

    const onClose = () => {
        setShowModal(false);
    };

        return (
            <div>
                <button onClick={() => {
                    setShowModal(true);
                }} className="btn btn-info btn-sm mt-0 ml-2">
                    Add country </button>

                {showModal && (<Modal className="add-country-modal" onClose={onClose}>
                    <h5>Adding Country</h5>
                    <div className="add-country-form">
                        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                            <div className="form-group">
                                <label htmlFor="countryName" className="form-label">
                                    <strong>Country name:</strong>
                                </label>
                                <input type="text"
                                       className={`form-control ${errors.name && "is-invalid"}`}
                                       placeholder="Country Name"
                                       id="countryName"
                                       name="name"
                                       onChange={handleChange}
                                       value={values.name || ""}
                                       required/>
                                {errors.name && (<p className="is-invalid invalid-feedback">
                                    {errors.name}</p>)}
                            </div>
                            <div className="form-group">
                                <label htmlFor="countryCode" className="form-label">
                                    <strong>Country Abbreviation:</strong>
                                </label>
                                <input type="text"
                                       className={`form-control ${errors.countryCode && "is-invalid"}`}
                                       placeholder="Country Code"
                                       id="countryCode"
                                       name="countryCode"
                                       onChange={handleChange}
                                       value={values.countryCode || ""}
                                       required/>
                                {errors.countryCode && (<p className="is-invalid invalid-feedback">
                                    {errors.countryCode}</p>)}
                            </div>
                            <div className="form-group">
                                <label htmlFor="feeMultiplier" className="form-label">
                                    <strong>Fee multiplier:</strong>
                                </label>
                                <input type="text"
                                       className={`form-control ${errors.feeMultiplier && "is-invalid"}`}
                                       placeholder="Fee Multiplier"
                                       id="feeMultiplier"
                                       name="feeMultiplier"
                                       onChange={handleChange}
                                       value={values.feeMultiplier || ""}
                                       required/>
                                {errors.feeMultiplier && (<p className="is-invalid invalid-feedback">
                                    {errors.feeMultiplier}</p>)}
                            </div>

                            <div className="text-center form-buttons">
                                <button className="btn btn-info" type="submit">Add</button>
                                <button onClick={onClose} className="btn btn-danger ml-2">Cancel</button>
                            </div>


                        </form>

                    </div>

                </Modal>)}
            </div>
        );

    };

export default AddCountryModal;
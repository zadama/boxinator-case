import Modal from "../../components/modal/index";
import React from "react";
import useForm from "./useForm";
import validate from "./FormValidations";

const { useState } = require("react");

const AddCountryModal = props => {

    const [modal, showModal] = useState(false);

    const {values, errors, handleChange, handleSubmit} = useForm(addCountry, validate);

    function addCountry() {
        props.addCountry(values);
        showModal(false);
    }

    const onClose = () => {
        showModal(false);
    };

        return (
            <div>
                <button onClick={() => {
                    showModal(true);
                }} className="btn btn-info btn-sm mt-0">
                    Add country </button>

                <Modal className="add-country-modal" isVisible={modal} onClose={onClose}>

                    <div className="add-country-form">

                        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                            <div className="form-group">
                                <label htmlFor="countryName" className="form-label">
                                    <strong>Country name:</strong>
                                </label>
                                <input type="text"
                                       className={`form-control has-validation ${errors.name && "is-invalid"}`}
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
                                       className={`form-control has-validation ${errors.countryCode && "is-invalid"}`}
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
                                       className={`form-control has-validation ${errors.feeMultiplier && "is-invalid"}`}
                                       placeholder="Fee Multiplier"
                                       id="feeMultiplier"
                                       name="feeMultiplier"
                                       onChange={handleChange}
                                       value={values.feeMultiplier || ""}
                                       required/>
                                {errors.feeMultiplier && (<p className="is-invalid invalid-feedback">
                                    {errors.feeMultiplier}</p>)}
                            </div>
                            <button className="btn btn-info"
                                    type="submit">Add</button>
                            <button onClick={onClose} className="btn btn-danger">Cancel</button>

                        </form>

                    </div>

                </Modal>
            </div>
        );

    };

export default AddCountryModal;
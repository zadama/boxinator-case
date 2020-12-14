import Modal from "../../components/modal/index";
import React, {useEffect} from "react";
import useForm from "./useForm";
import validate from "./FormValidations";

const { useState } = require("react");

const EditModal = props => {

    const [modal, showModal] = useState(false);
    const [id, setId] = useState(props.country.id);

    const updateCountry = () => {
        props.updateCountry({id, ...values});
        showModal(false);
    };

    const {values, setValues, setErrors, errors, handleChange, handleSubmit} = useForm(updateCountry, validate);

    useEffect (() => {
        setValues(props.country);
    }, [props.country])


    const onClose = () => {
        setValues(props.country);
        setErrors({});
        showModal(false);
    };

    return (
        <div className="edit-country-modal">
            <button onClick={() => {
                showModal(true);
            }} className="btn btn-info btn-sm ml-2 mt-0">Edit</button>

            <Modal isVisible={modal} onClose={onClose}>

                <div className="edit-country-form">
                    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                        <div className="form-group">
                            <label htmlFor="countryName">
                                <strong>Country name:</strong>
                            </label>
                            <input  type="text"
                                    className={`form-control has-validation ${errors.name && "is-invalid"}`}
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
                                    className={`form-control has-validation ${errors.countryCode && "is-invalid"}`}
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
                                    className={`form-control has-validation ${errors.feeMultiplier && "is-invalid"}`}
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

            </Modal>
        </div>
    );
};

export default EditModal;
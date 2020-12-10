import Modal from "../../components/modal/index";
import React from "react";

const { useState } = require("react");

const EditModal = props => {

    const [modal, showModal] = useState(false);
    const [id, setId] = useState(props.country.id);
    const [name, setName] = useState(props.country.name);
    const [countryCode, setCountryCode] = useState(props.country.countryCode);
    const [feeMultiplier, setFeeMultiplier] = useState(props.country.feeMultiplier);

    const onCountryNameChanged = event => setName(event.target.value.trim());
    const onCountryCodeChanged = event => setCountryCode(event.target.value.trim());
    const onFeeMultiplierChanged = event => setFeeMultiplier(event.target.value.trim());

    const onClose = () => {
        showModal(false);
    };

    const onUpdateClicked = () => {
        props.updateCountry({id, name, countryCode, feeMultiplier});
        showModal(false);
    }


    return (
        <div className="edit-country-modal">
            <button onClick={() => {
                showModal(true);
            }} className="btn btn-info btn-sm mt-0">Edit</button>

            <Modal isVisible={modal} onClose={onClose}>

                <div className="edit-country-form">
                    <form>
                        <div className="form-group">
                            <label htmlFor="countryName">Country name: </label>
                            <input type="text" className="form-control"
                                   value={name} id="countryName"
                                   onChange={onCountryNameChanged}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="countryCode">Country code: </label>
                            <input type="text" className="form-control"
                                   value={countryCode} id="countryCode"
                                   onChange={onCountryCodeChanged}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="feeMultiplier">Fee Multiplier: </label>
                            <input type="text" className="form-control"
                                   value={feeMultiplier} id="feeMultiplier"
                                   onChange={onFeeMultiplierChanged}/>
                        </div>
                    </form>
                </div>
                <button onClick={onUpdateClicked} className="btn btn-info">Save</button>
                <button onClick={onClose} className="btn btn-danger">Cancel</button>
            </Modal>
        </div>
    );
};

export default EditModal;
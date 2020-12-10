import Modal from "../../components/modal/index";
import React from "react";

const { useState } = require("react");

const AddCountryModal = props => {

    const [modal, showModal] = useState(false);

    const [countryName, setCountryName] = useState("");
    const [countryCode, setCountryCode] = useState("");
    const [feeMultiplier, setFeeMultiplier] = useState(0);

    const onAddClicked = () => {
        props.addCountry(countryName, countryCode, feeMultiplier);
        showModal(false);
    }

    const onClose = () => {
        showModal(false);
    };

        const onCountryNameChanged = event => setCountryName(event.target.value.trim());
        const onCountryCodeChanged = event => setCountryCode(event.target.value.trim());
        const onFeeMultiplierChanged = event => setFeeMultiplier(event.target.value.trim());

        return (
            <div>
                <button onClick={() => {
                    showModal(true);
                }} className="btn btn-info btn-sm mt-0"
                        type="submit"> Add country </button>

                <Modal className="add-country-modal" isVisible={modal} onClose={onClose}>
                    <div className="add-country-form">
                        <form>
                            <div className="form-group">
                                <label htmlFor="countryName">Country name: </label>
                                <input type="text" className="form-control"
                                       placeholder="Country Name" id="countryName"
                                       onChange={onCountryNameChanged}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="countryCode">Country code: </label>
                                <input type="text" className="form-control"
                                       placeholder="Country Code" id="countryCode"
                                       onChange={onCountryCodeChanged}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="feeMultiplier">Fee Multiplier: </label>
                                <input type="text" className="form-control"
                                       placeholder="Fee Multiplier" id="feeMultiplier"
                                       onChange={onFeeMultiplierChanged}/>
                            </div>
                        </form>
                    </div>
                    <button onClick={onAddClicked} className="btn btn-info"
                            type="button">Add</button>
                </Modal>
            </div>
        );

    };

export default AddCountryModal;
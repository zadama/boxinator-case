import Modal from "../../components/modal";
import "./styles.scss";
import React from "react";

import {faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const { useState } = require("react");

const DeleteCountryModal = (props) => {

    const [modal, showModal] = useState(false);
    const [id, setId] = useState(props.country.id);
    const [name] = useState(props.country.name);
    const [countryCode] = useState(props.country.countryCode);
    const [feeMultiplier] = useState(props.country.feeMultiplier);

    const onClose = () => {
        showModal(false);
    };

    const onDeleteClicked = () => {
        props.deleteCountry(id);
        showModal(false);

    };

    return (
        <div className="delete-country-modal">
            <button
                onClick={() => {
                    showModal(true);
                }} className="btn btn-danger btn-sm ml-2 mt-0">
                <FontAwesomeIcon icon={faTrashAlt}/>
            </button>

            <Modal isVisible={modal} onClose={onClose}>
                <div>
                    <h5>Are you sure?</h5>
                    <p>This entry will be permanently removed from the database.
                        You can't undo this action. </p>
                    <table className="table">
                        <tbody>
                            <tr>
                                <td>Country: <strong>{name}</strong></td>
                                <td>Country code: <strong>{countryCode}</strong></td>
                                <td>Fee multiplier: <strong>{feeMultiplier}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="row">
                    <button onClick={onDeleteClicked} className="btn btn-danger btn-sm">Delete</button>
                    <button onClick={onClose} className="btn btn-light btn-sm"><strong> Oops! Cancel</strong></button>
                </div>

            </Modal>
        </div>
    );
};

export default DeleteCountryModal;
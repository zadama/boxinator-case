import React, { useState } from 'react';
import Modal from '../../../components/modal/index';
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import "./styles.scss";

const DeleteShipmentModal = (props) => {

    const [showModal, setShowModal] = useState(false);

    const onDelete = () => {
        props.deleteShipment(props.shipment.id);
        setShowModal(false);
    }

    const onClose = () => {
        setShowModal(false);
    }

    return (
        <div>
            <Button variant="danger btn-sm ml-2" onClick={() => setShowModal(true)}><FontAwesomeIcon icon={faTrashAlt} /></Button>

            {showModal && (<Modal onClose={onClose}>
                <div>
                    <h5>Are you sure?</h5>
                    <p>This record will be permanently removed from the database.
                            You can't undo this action.</p>
                    <div className="text-center">
                        <button className="btn btn-danger btn-sm" onClick={onDelete}>
                            Delete
                        </button>

                        <button className="btn btn-light btn-sm ml-2" onClick={onClose}>
                            <strong>Cancel</strong>
                        </button>
                    </div>
                </div>
            </Modal>)}

        </div>

    );

};

export default DeleteShipmentModal;
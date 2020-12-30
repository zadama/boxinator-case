import React, { useState } from 'react';
import Modal from '../../../components/modal/index';
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const DeleteShipmentModal = (props) => {

    const [showModal, setShowModal] = useState(false);

    const onDelete = () => {
        props.deleteShipment(props.shipment.id);
        setShowModal(false);
    }

    const onClose = () => {
        showModal(false);
    }

    return (
        <div>
            <Button variant="danger btn-sm ml-2" onClick={() => setShowModal(true)}><FontAwesomeIcon icon={faTrashAlt} /></Button>

            {showModal && (<Modal onClose={onClose}>
                <h5>Are you sure?</h5>
                <p>This record will be permanently removed from the database.
                        You can't undo this action.</p>
                <button className="btn btn-danger btn-sm" onClick={onDelete}>
                    Delete
                </button>

                <button className="btn btn-light btn-sm ml-2" onClick={onClose}>
                    Cancel
                 </button>
            </Modal>)}

        </div>

    );

};

export default DeleteShipmentModal;
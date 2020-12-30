import React, { useState, useEffect } from 'react';
import Modal from '../../../components/modal/index';

const DeleteShipmentModal = (props) => {
    
    const [showModal, setShowModal] = useState(true);
    
    const onDelete = () => {
        props.deleteShipment(props.thisShipment.id);
        setShowModal(false);
    }

    const onClose = () => {
        setShowModal(false);
        props.onClose();
      }

    return (
        <div className="container">
    {showModal && (<Modal onClose={onClose}>
            <p>Are you sure you want to delete this record?</p>
    <button onClick = {onDelete}>
        Yes
    </button>

    <button onClick ={props.onClose}>
        No
    </button>
    </Modal> )}
    
    </div>
    
    );

};

export default DeleteShipmentModal;
import React from 'react';
import {Modal, Button, Row, Col, Form} from 'react-bootstrap';

const EditShipmentModal = (props) => {
   
        return (
            <Modal
      
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Shipment
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <p>{props.thisShipment.weight}</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary">Close</Button>
      </Modal.Footer>
    </Modal>

        );
    
}

export default EditShipmentModal;
import React, { useState } from 'react';
import { Button, Dropdown, DropdownButton, Form } from 'react-bootstrap';

import Modal from '../../components/modal/index';

const EditShipmentModal = (props) => {

  const [showModal, setShowModal] = useState(true);

  const onClose = () => {
    setShowModal(false);
    props.onClose();
  }

  return (
    <Modal isVisible={showModal} onClose={onClose}>

      <div className="container">
        <Form>
          <div className="form-group">
            <label htmlFor="shipment-id">
              <strong>Shipment ID:</strong>
            </label>
            <input
              className="form-control"
              id="shipment-id"
              defaultValue={props.thisShipment.id}
              required/>
          </div>

          <div className="form-group">
            <label htmlFor="account-id">
              <strong>Account ID:</strong>
            </label>
            <input
              className="form-control"
              id="account-id"
              defaultValue={props.thisShipment.account.id}
              required/>
          </div>

          <div className="form-group">
            <label htmlFor="receiver">
              <strong>Receiver:</strong>
            </label>
            <input
              type="text"
              className="form-control"
              id="receiver"
              defaultValue={props.thisShipment.receiver}
              required/>
          </div>

          <div className="form-group">
            <label htmlFor="weight">
              <strong>Weight:</strong></label>
            <input
              className="form-control"
              id="weight"
              defaultValue={props.thisShipment.weight}
              required/>
          </div>

          <div className="form-group">
            <label htmlFor="box-colour">
              <strong>Box Colour:</strong></label>
            <input
              className="form-control"
              id="box-colour"
              defaultValue={props.thisShipment.boxColour}
              required/>
          </div>

          
          <div className="form-group">
          <label htmlFor="shipment-status">
                  <strong>Shipment Status: </strong></label >
            <DropdownButton id="shipment-status" title={props.thisShipment.shipmentStatus}>
                <Dropdown.Item>CREATED</Dropdown.Item>
                <Dropdown.Item>RECIEVED</Dropdown.Item>
                <Dropdown.Item>INTRANSIT</Dropdown.Item>
                <Dropdown.Item>COMPLETED</Dropdown.Item>
                <Dropdown.Item>CANCELLED</Dropdown.Item>
            </DropdownButton>
          </div>

          <div className="form-group">
            <label htmlFor="destination-country">
              <strong>Destination Country:</strong></label>
            <input
              className="form-control"
              id="destination-country"
              defaultValue={props.thisShipment.destinationCountry}
              required/>
          </div>

          <div className="form-group">
            <label htmlFor="source-country">
              <strong>Source Country:</strong></label>
              <DropdownButton id="source-country" title={props.thisShipment.sourceCountry}>
                <Dropdown.Item>Denmark</Dropdown.Item>
                <Dropdown.Item>Norway</Dropdown.Item>
                <Dropdown.Item>Sweden</Dropdown.Item>
                </DropdownButton>
          </div>

          <button type="submit" className="btn btn-info">Save</button>
          <button onClick={onClose} className="btn btn-danger">Cancel</button>
        </Form>
      </div>
    </Modal>

  );

}

export default EditShipmentModal;
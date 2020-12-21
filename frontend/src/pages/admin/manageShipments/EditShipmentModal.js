import React, { useState, useEffect } from 'react';
import {useAuth} from "../../../context/auth";
import { Button, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import useForm from "../../country/useForm";
import Modal from '../../../components/modal/index';
import { statusValues } from "../../../utils/shipmentStatusValues";
import validate from "./ShipmentValidations";
import {getAllCountries} from "../../../api/countries";

const EditShipmentModal = (props) => {
  
  const auth = useAuth();
  const [showModal, setShowModal] = useState(true);
  const [countries, setCountries] = useState([]);
  const [id, setId] = useState(props.thisShipment.id); 

  //put functionFromParent here for update logic
  const updateShipment = () => {
    props.updateShipment({id, ...values});
    setShowModal(false);
  }
  
  const {values, setValues, setErrors, errors, handleChange, handleSubmit} = useForm("functionfromParent", validate);


 useEffect( () => {
   getCountries();
 }, []); 

  const getCountries = async () => {
    try {
      const token = await auth.getUserToken();
      let response = await getAllCountries(token);
      let {data: savedCountries} = response.data;
      savedCountries = savedCountries.map((country) => {
        return {
          id: country.id,
          name: country.name,
        };
      });
      setCountries(savedCountries);
    } catch(error) {
      console.log(error, "Unable to get countries.");
    }
  };

  const destinationCountries = countries.map((country, id) => {
  return(
    <Dropdown.Item key={country.id}>{country.name}</Dropdown.Item>
  );
  });

  const onClose = () => {
    setValues(props.thisShipment);
    setErrors({});
    setShowModal(false);
    props.onClose();
  }

  return (
    <div className="container">
    {showModal && (<Modal onClose={onClose}>
        <Form onSubmit={handleSubmit} className="needs-validation" noValidate>
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
              className={`form-control ${errors.receiver && "is-invalid"}`}
              id="receiver"
              name="receiver"
              defaultValue={props.thisShipment.receiver || ""}
              onChange={handleChange}
              required/>
              {errors.receiver && (<p className="is-invalid invalid-feedback">{errors.receiver}</p>)}
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
                {statusValues.map(function(status) {
                  return (
                    <Dropdown.Item key={status}>{status}</Dropdown.Item>
                  )
                })}
            </DropdownButton>
          </div>

          <div className="form-group">
            <label htmlFor="destination-country">
              <strong>Destination Country:</strong></label>
              <DropdownButton id="destination-country" title={props.thisShipment.destinationCountry.name}>
                {destinationCountries}
            </DropdownButton>
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

          <Button type="submit" className="btn btn-info">Save</Button>
          <Button onClick={onClose} className="btn btn-danger">Cancel</Button>
        </Form>
    </Modal>)}
    </div>
  );

};

export default EditShipmentModal;
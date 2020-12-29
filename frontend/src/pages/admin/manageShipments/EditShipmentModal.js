import React, { useState, useEffect } from 'react';
import {useAuth} from "../../../context/auth";
import { Button, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import Modal from '../../../components/modal/index';
import { statusValues } from "../../../utils/shipmentStatusValues";
import validate from "./ShipmentValidations";
import {getAllCountries} from "../../../api/countries";
import {updateShipment} from "../../../api/shipments";
import { useForm, Controller } from 'react-hook-form';
import Toaster from "../../../components/toast/Toaster";

const EditShipmentModal = (props) => {
  
  const auth = useAuth();
  const [showModal, setShowModal] = useState(true);
  const [countries, setCountries] = useState([]);
  const [id, setId] = useState(props.thisShipment.id); 

  const [toastHeader, setToastHeader] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [toast, setToast] = useState(false);

  //put functionFromParent here for update logic
 // const updateShipment = () => {
  //  props.updateShipment({id, ...values});
   // setShowModal(false);
 // }
  
  const { register, handleSubmit, errors, control, watch } = useForm();


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
    <option key={country.id}>{country.name}</option>
  );
  });

  const onClose = () => {
    setShowModal(false);
    props.onClose();
  }

  const onUpdateShipmentClicked = async (shipment) => {
    console.log("onupdateshipmentclicked");
    try {
      const token = await auth.getUserToken();
      await updateShipment(shipment, token);
      setToastHeader("Success");
      setToastMsg("Shipment record was updated successfully.");
      setToast(true);
    } catch (error) {
      console.log(error, "Unable to update shipment");
      setToastHeader("Error");
      setToastMsg("Unable to update shipment record details.");
      setToast(true);
    } finally {
      setShowModal(!showModal);
    }

  }

  return (
    <div className="container">
    {showModal && (<Modal onClose={onClose}>
        <form onSubmit={handleSubmit(onUpdateShipmentClicked)} className="needs-validation">
          <div className="form-group">
            <label htmlFor="shipment-id">
              <strong>Shipment ID:</strong>
            </label>
            <input
              className="form-control"
              id="shipment_id"
              name = "shipment_id"
              defaultValue={props.thisShipment.id}
              ref={register(
                {required: true}
            )}
              readOnly/>
          </div>

          <div className="form-group">
            <label htmlFor="account-id">
              <strong>Account ID:</strong>
            </label>
            <input
              className="form-control"
              id="account-id"
              name = "account-id"
              defaultValue={props.thisShipment.account.id}
              ref={register(
                {required: true}
                )}
              readOnly/>
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
              ref={register({
                required: true,
                pattern: {
                    value: /^[A-Za-z]+$/,
                    message: "invalid format"
                }
            })}
              />
          {errors.receiver?.type === "required" && (
          <span className="error-span">Please enter your desired receiver.</span>
        )}
        {errors.receiver?.type === "pattern" && (
          <span className="error-span">Invalid receiver format.</span>
        )}        </div>
          <div className="form-group">
            <label htmlFor="weight">
              <strong>Weight:</strong></label>
              {/*TODO FIX REGEX ^[0-9]*$ */}
            <input
              className="form-control"
              id="weight"
              name ="weight"
              defaultValue={props.thisShipment.weight}
              ref={register({
                required: true,
               pattern: {
                 value: /^[0-9]*$/,
                message: "invalid format"
               }
            })}
              />
              {errors.weight?.type === "required" && (
          <span className="error-span">Please enter your desired weight.</span>
        )}
        {errors.weight?.type === "pattern" && (
          <span className="error-span">Invalid weight format.</span>
        )}        
          </div>
            
            {/*TODO - fix validation */}
          <div className="form-group">
            <label htmlFor="box-colour">
              <strong>Box Colour:</strong></label>
            <input
              className="form-control"
              id="box-colour"
              name="box-colour"
              defaultValue={props.thisShipment.boxColour}
              ref={register(
                {required: true}
            )}
              />
          </div>

          
          <div className="form-group">
          <label htmlFor="shipment-status">
                  <strong>Shipment Status: </strong></label >
            <select id="shipment-status" 
            title={props.thisShipment.shipmentStatus}
            name="shipment-status"
            ref={register(
              {required: true}
          )}
            >
                {statusValues.map(function(status) {
                  return (
                    <option key={status}>{status}</option >
                  )
                })}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="destination-country">
              <strong>Destination Country:</strong></label>
              <select id="destination-country" title={props.thisShipment.destinationCountry.name}>
                {destinationCountries}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="source-country">
              <strong>Source Country:</strong></label>
              <select id="source-country" title={props.thisShipment.sourceCountry}>
                <option>Denmark</option>
                <option>Norway</option>
                <option>Sweden</option>
                </select>
          </div>

          <Button type="submit" className="btn btn-info">Save</Button>
          <Button onClick={onClose} className="btn btn-danger">Cancel</Button>
        </form>
    </Modal>)}
    </div>
  );

};

export default EditShipmentModal;
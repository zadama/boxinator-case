import React from "react";
import { Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { statusValues } from "../../../utils/shipmentStatusValues";

const EditShipmentForm = (props) => {
  const { register, handleSubmit, errors, control, watch } = useForm();

    const { register, handleSubmit, errors, control, watch } = useForm();


    const destinationCountries = props.countries.map((country, id) => {
        return(
          <option key={id}>{country.name}</option>
        );
        });

    return(<form onSubmit={handleSubmit(props.updateShipment)} className="needs-validation">
    <div className="form-group">
      <label htmlFor="shipment-id">
        <strong>Shipment ID:</strong>
      </label>
      <input
        className="form-control"
        id="shipment_id"
        name = "shipment_id"
        defaultValue={props.shipment.id}
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
        defaultValue={props.shipment.account}
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
        defaultValue={props.shipment.receiver || ""}
        ref={register({
          required: true,
          pattern: {

              value: /^[A-Za-z]+$/,
              message: "invalid format",
            },
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
      <input
        className="form-control"
        id="weight"
        name ="weight"
        defaultValue={props.shipment.weight}
        ref={register({
          required: true,
         pattern: {
           value: /[^0-9]*$/,
          message: "invalid format"
         }
      })}

        {errors.receiver?.type === "required" && (
          <span className="error-span">
            Please enter your desired receiver.
          </span>
        )}
        {errors.receiver?.type === "pattern" && (
          <span className="error-span">Invalid receiver format.</span>
        )}{" "}
      </div>
      <div className="form-group">
        <label htmlFor="weight">
          <strong>Weight:</strong>
        </label>
        <input
          className="form-control"
          id="weight"
          name="weight"
          defaultValue={props.shipment.weight}
          ref={register({
            required: true,
            pattern: {
              value: /^[0-9]*$/,
              message: "invalid format",
            },
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
        name="boxColour"
        defaultValue={props.shipment.boxColour}
        ref={register(
          {required: true}
      )}

        />
      </div>

    
    <div className="form-group">
    <label htmlFor="shipment-status">
            <strong>Shipment Status: </strong></label >
      <select id="shipment-status" 
      defaultValue={props.shipment.shipmentStatus}
      name="shipmentStatus"
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
        <select 
        id="destination-country" 
        name="destinationCountry"
        defaultValue={props.shipment.destinationCountry.name}
        >
          {destinationCountries}
        </select>
      </div>

    <div className="form-group">
      <label htmlFor="source-country">
        <strong>Source Country:</strong></label>
        <select id="source-country" 
        name="sourceCountry" 
        ref={register}
        defaultValue={props.shipment.sourceCountry}
        >
          <option>Denmark</option>
          <option>Norway</option>
          <option>Sweden</option>
        </select>
      </div>


    <Button type="submit" className="btn btn-info" value="Save">Save</Button>
    <Button onClick={props.onClose} className="btn btn-danger">Cancel</Button>
  </form>);
}
export default EditShipmentForm;

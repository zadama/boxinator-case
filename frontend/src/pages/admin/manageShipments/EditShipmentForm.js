import React, { useRef, useState } from "react";
import { Button, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { statusValues } from "../../../utils/shipmentStatusValues";

import ColorPicker from "../../shipment/components/ColorPicker";
import { ntc as convertHex, namesToHex } from "../../../utils/ntc";

import Select from "react-select";

const EditShipmentForm = (props) => {
  const { register, handleSubmit, errors, control, watch } = useForm();

  const [shipmentStatus, setShipmentStatus] = useState({
    label: props.shipment.shipmentStatus,
    value: props.shipment.shipmentStatus,
  });
  const [destinationCountry, setDestinationCountry] = useState({
    label: props.shipment.destinationCountry,
    value: props.shipment.destinationCountry,
  });
  const [sourceCountry, setSourceCountry] = useState({
    label: props.shipment.sourceCountry,
    value: props.shipment.sourceCountry,
  });

  const boxColour = useRef(props.shipment.boxColour);

  const onHandleColorPicker = (color) => {
    const match = convertHex.name(color.hex);
    const colorName = match[1];
    boxColour.current = colorName;
  };

  const handleForm = (data) => {
    data.destinationCountry = { name: destinationCountry.value };
    data.boxColour = boxColour.current;
    data.shipmentStatus = shipmentStatus.value;
    props.updateShipment(data);
  };

  return (
    <form
      style={{
        width: "85%",
        paddingTop: "10px",
        paddingBottom: "15px",
      }}
      onSubmit={handleSubmit(handleForm)}
      className="needs-validation"
    >
      <div className="form-group">
        <label htmlFor="shipment-id">
          <strong>Shipment ID:</strong>
        </label>
        <input
          className="form-control"
          id="shipment_id"
          name="shipment_id"
          defaultValue={props.shipment.id}
          ref={register({ required: true })}
          readOnly
        />
      </div>

      <div className="form-group">
        <label htmlFor="account-id">
          <strong>Account ID:</strong>
        </label>
        <input
          className="form-control"
          id="account_id"
          name="account_id"
          defaultValue={props.shipment.account}
          ref={register({ required: true })}
          readOnly
        />
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
          <span className="error-span">
            Please enter a shipment receiver.
          </span>
        )}
        {errors.receiver?.type === "pattern" && (
          <span className="error-span">Invalid receiver format.</span>
        )}
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
          <span className="error-span">Please enter the shipment's weight.</span>
        )}
        {errors.weight?.type === "pattern" && (
          <span className="error-span">Invalid weight format.</span>
        )}
      </div>

      {/*TODO - fix validation */}
      <div className="form-group">
        <label htmlFor="box-colour">
          <strong>Box Colour:</strong>
        </label>
        <ColorPicker
          defaultValue={namesToHex[props.shipment.boxColour]}
          onHandleColorPicker={onHandleColorPicker}
        />
      </div>

      <div className="form-group">
        <label htmlFor="shipment-status">
          <strong>Shipment Status: </strong>
        </label>

        <Select
          value={shipmentStatus}
          className="select-picker"
          placeholder={"Select status"}
          options={statusValues.map((item) => {
            return {
              label: item,
              value: item,
            };
          })}
          isSearchable={false}
          onChange={(data) => {
            setShipmentStatus(data);
          }}
        />
      </div>

      <div className="form-group">
        <label htmlFor="destination-country">
          <strong>Destination Country:</strong>
        </label>
        <Select
          value={destinationCountry}
          className="select-picker"
          placeholder={"Select destination country"}
          options={props.countries.map((item) => {
            return {
              label: item.name,
              value: item.name,
            };
          })}
          isSearchable={false}
          onChange={(data) => {
            setDestinationCountry(data);
          }}
        />
      </div>

      <div className="form-group">
        <label htmlFor="source-country">
          <strong>Source Country:</strong>
        </label>
        <Select
          value={sourceCountry}
          className="select-picker"
          placeholder={"Select source country"}
          options={[
            {
              label: "Sweden",
              name: "Sweden",
            },
            {
              label: "Norway",
              name: "Norway",
            },
            {
              label: "Denmark",
              name: "Denmark",
            },
          ]}
          isSearchable={false}
          onChange={(data) => {
            setSourceCountry(data);
          }}
        />
      </div>

      <div className="btn-container-form">
        <Button type="submit" className="btn btn-primary" value="Save">
          Save
        </Button>
        <Button onClick={props.onClose} className="btn btn-secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EditShipmentForm;

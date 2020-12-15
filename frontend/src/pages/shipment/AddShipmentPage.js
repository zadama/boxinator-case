import React, { useState, useRef, useEffect } from "react";
import PrivateLayout from "../../layouts/PrivateLayout";
import "./style.scss";
import Button from "react-bootstrap/Button";
import { useAuth } from "../../context/auth";
import ShipmentForm from "./components/ShipmentForm";
import CompleteOrder from "./components/CompleteOrder";
import { createShipment } from "../../api/shipments";
import { ntc as convertHex } from "../../utils/ntc";

const AddShipmentPage = ({ history }) => {
  const isFirstSubmission = useRef(true);

  const { logout, getUserToken } = useAuth();
  const [state, setState] = useState({
    sourceCountry: { value: "", label: "" },
    destinationCountry: { value: "", label: "", feeMultiplier: "" },
    colorValue: "",
    boxWeight: "0",
    receiver: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    // differentiate between general event and react-select event.
    const name = event.target
      ? event.target.name
      : event.feeMultiplier
      ? "destinationCountry"
      : "sourceCountry";
    const value = event.target
      ? event.target.value
      : event.feeMultiplier
      ? {
          ...state.destinationCountry,
          value: event.value,
          label: event.label,
          feeMultiplier: event.feeMultiplier,
        }
      : { ...state.sourceCountry, value: event.value, label: event.label };

    setState({ ...state, [name]: value });
  };

  const setColorValue = (color) => {
    setState({ ...state, colorValue: color });
  };

  useEffect(() => {
    if (isFirstSubmission.current) {
      return;
    }

    hasErrors();
  }, [state]);

  const hasErrors = () => {
    let hasErr = false;
    let errorObj = {};

    if (state.receiver === "") {
      errorObj.receiver = "Receiver is required.";
      hasErr = true;
    }
    if (state.boxWeight === "0" || state.boxWeight === "") {
      errorObj.boxWeight = "Box Weight is required.";
      hasErr = true;
    }
    if (state.destinationCountry.value === "") {
      errorObj.destinationCountry = "Destination country must be picked.";
      hasErr = true;
    }

    if (state.colorValue === "") {
      errorObj.colorValue = "A color must be picked.";
      hasErr = true;
    }

    if (state.sourceCountry.value === "") {
      errorObj.sourceCountry = "Source country must be picked.";
      hasErr = true;
    }

    setErrors(errorObj);

    return hasErr;
  };

  const onHandleShipment = async () => {
    if (hasErrors()) {
      if (isFirstSubmission.current) {
        isFirstSubmission.current = false;
      }
      return;
    }

    const match = convertHex.name(state.colorValue);
    const colorName = match[1];
    try {
      const token = await getUserToken();
      // set shipmentstatus in backend instead? (IN_TRANSIT part)
      const result = await createShipment(
        {
          weight: state.boxWeight,
          boxColour: colorName ? colorName : state.colorValue,
          receiver: state.receiver,
          sourceCountry: state.sourceCountry.value,
          shipmentStatus: "IN_TRANSIT",
          destinationCountry: state.destinationCountry.value,
        },
        token
      );

      if (result.status === 201) {
        // create a confirm modal of some sort...
        // also maybe, redirect to user handle shipments?
        // Send shipment Id with and show success message in handle shipments instead
        // with latest shipment highlughted by getting shipment id in location state

        alert(
          "Shipment was addded! This will change to something more appropriate, when other pages are done; such as redirect,alerts etc."
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PrivateLayout>
      <div className="container">
        <h1>Place a new shipment</h1>

        <div className="add-shipment-container">
          <ShipmentForm
            setColorValue={setColorValue}
            handleChange={handleChange}
            state={state}
            errors={errors}
          />

          <div className="shipment-summary-container">
            <CompleteOrder state={state} onHandleShipment={onHandleShipment} />
          </div>
        </div>
      </div>

      <Button
        onClick={async () => {
          await logout();
          history.replace("/login");
        }}
      >
        Logout
      </Button>
    </PrivateLayout>
  );
};

export default AddShipmentPage;

import React, { useState } from "react";
import PrivateLayout from "../../layouts/PrivateLayout";
import "./style.scss";
import Button from "react-bootstrap/Button";
import { useAuth } from "../../context/auth";
import ShipmentForm from "./components/ShipmentForm";
import CompleteOrder from "./components/CompleteOrder";
import { createShipment } from "../../api/shipments";

const AddShipmentPage = ({ history }) => {
  const { logout, getUserToken } = useAuth();
  const [state, setState] = useState({
    sourceCountry: { value: "", label: "" },
    destinationCountry: { value: "", label: "", feeMultiplier: "" },
    colorValue: "",
    boxWeight: "0",
    receiver: "",
  });

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

  const onHandleShipment = async () => {
    try {
      const token = await getUserToken();
      // set shipmentstatus in backend instead?
      const result = await createShipment(
        {
          weight: state.boxWeight,
          boxColour: state.colorValue,
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

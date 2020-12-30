import React, { useState, useRef, useEffect } from "react";
import PrivateLayout from "../../layouts/PrivateLayout";
import "./style.scss";
import Button from "react-bootstrap/Button";
import { useAuth } from "../../context/auth";
import ShipmentForm from "./components/ShipmentForm";
import CompleteOrder from "./components/CompleteOrder";
import TruckLoader from "../../components/truck-loader";
import { createShipment, addShipmentReceipt } from "../../api/shipments";
import { ntc as convertHex } from "../../utils/ntc";
import { GUEST } from "../../utils/roles";
import Alert from "../../components/alert";

const AddShipmentPage = ({ history }) => {
  const isFirstSubmission = useRef(true);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const { logout, getUserToken } = useAuth();
  const [state, setState] = useState({
    sourceCountry: { value: "", label: "" },
    destinationCountry: { value: "", label: "", feeMultiplier: "" },
    colorValue: "",
    boxWeight: "0",
    receiver: "",
  });

  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState(null);

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

  // handle error-handling for both guest and normal USER, add aler
  // Add also success alert after setIsLoading(false) after recipt shipment (have it in try catch)
  const onHandleShipment = async () => {
    if (hasErrors()) {
      if (isFirstSubmission.current) {
        isFirstSubmission.current = false;
      }
      return;
    }

    setIsLoading(true);

    const match = convertHex.name(state.colorValue);
    const colorName = match[1];

    if (user.role === GUEST) {
      try {
        await addShipmentReceipt({
          weight: state.boxWeight,
          boxColour: colorName,
          destinationCountry: state.destinationCountry.value,
          sourceCountry: state.sourceCountry.value,
          receiver: state.receiver,
          recipient: user.email,
        });
        // set success message alert
        setAlertMessage({
          message:
            "We have sent you an email. Sign up with that to claim the shipment.",
          variant: "success",
        });
      } catch (error) {
        // set failure alert message alert
        setAlertMessage({
          message: "Failed to process shipment",
          variant: "danger",
        });
      } finally {
        setIsLoading(false);
      }

      return;
    }

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
        // Send shipment Id with and show success message in handle shipments instead
        // with latest shipment highlughted by getting shipment id in location state
        const { data: newShipment } = result.data;

        history.push({
          pathname: "/handleShipments",
          state: { claimShipment: newShipment.id },
        });
      }
    } catch (error) {
      console.log(error);
      // Set failure message alert
      setIsLoading(false);
      setAlertMessage({
        message: "Failed to process shipment",
        variant: "danger",
      });
    }
  };

  return (
    <PrivateLayout>
      <div className="container">
        <h1>Place a new shipment</h1>

        {isLoading && <TruckLoader />}

        {alertMessage && (
          <Alert
            message={alertMessage.message}
            onClose={() => {
              setAlertMessage(null);
            }}
            variant={alertMessage.variant}
            expire={3000}
          />
        )}

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
    </PrivateLayout>
  );
};

export default AddShipmentPage;

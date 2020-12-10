import React from "react";

const CompleteOrder = ({ onHandleShipment, state }) => {
  return (
    <>
      <h3>Order</h3>

      <h4>Weight: {state.boxWeight} kg</h4>

      <h4>X</h4>

      <h4>
        To {state.destinationCountry.label}:{" "}
        {state.destinationCountry.feeMultiplier} SEK
      </h4>

      <div className="total-price-container">
        <h4>
          Total Price:{" "}
          {state.destinationCountry.feeMultiplier * state.boxWeight} sek
        </h4>
      </div>

      <button
        style={{ fontSize: "1.6rem", fontWeight: "700" }}
        className="btn btn-action"
        onClick={onHandleShipment}
      >
        Place shipment order
      </button>
    </>
  );
};

export default CompleteOrder;

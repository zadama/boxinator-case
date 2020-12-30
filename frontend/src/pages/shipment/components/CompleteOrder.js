import React, { useState } from "react";
import Modal from "../../../components/modal";

const CompleteOrder = ({ onHandleShipment, state }) => {
  const [confirmModal, setConfirmModal] = useState(false);

  const handleClick = () => {
    setConfirmModal(false);
    onHandleShipment();
  };

  return (
    <>
      {confirmModal && (
        <Modal
          onClose={() => {
            setConfirmModal(false);
          }}
        >
          <div className="shipment-overview">
            <h1>Shipment</h1>

            <p>
              If you are happy with the shipment, please press confirm and we'll
              handle the order!
            </p>

            <section>
              <div>
                <strong>Receiver</strong>: {state.receiver}.
              </div>
              <div>
                <strong>Destination</strong>: {state.destinationCountry.label}.
              </div>
              <div>
                <strong>Weight</strong>: {state.boxWeight}kg.{" "}
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <strong>Color</strong>:
                <div
                  style={{
                    backgroundColor: state.colorValue,
                    height: "20px",
                    width: "20px",
                    borderRadius: "2px",
                    margin: "0px",
                    marginLeft: "5px",
                  }}
                ></div>
              </div>
            </section>

            <p>
              <strong>Total</strong>:{" "}
              {state.destinationCountry.feeMultiplier * state.boxWeight} SEK.
            </p>

            <button className="btn btn-action" onClick={handleClick}>
              Confirm
            </button>
          </div>
        </Modal>
      )}

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
        onClick={() => {
          setConfirmModal(true);
        }}
      >
        Place shipment order
      </button>
    </>
  );
};

export default CompleteOrder;

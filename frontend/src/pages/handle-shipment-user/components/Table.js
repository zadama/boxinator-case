import React from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CANCELLED } from "../../../utils/shipmentStatusValues";

const Table = ({ shipments, selectedShipment, handleShipmentClicked }) => {
  return (
    <>
      {shipments ? (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Receiver</th>
              <th>Weight</th>
              <th>Color</th>
              <th>Price</th>
              <th>Destination</th>
              <th>Ordered</th>
              <th>Status</th>
              <th className="cancel-shipment">Cancel shipment?</th>
            </tr>
          </thead>
          <tbody>
            {shipments
              .sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
              })
              .map((item) => (
                <tr
                  className={
                    selectedShipment && item.id === selectedShipment.id
                      ? "active-row"
                      : ""
                  }
                  key={item.id}
                >
                  <td>{item.receiver}</td>
                  <td>{item.weight}</td>
                  <td>{item.boxColour}</td>
                  <td>{item.totalPrice}</td>
                  <td>{item.destinationCountry}</td>
                  <td>
                    {new Date(item.createdAt)
                      .toISOString()
                      .slice(0, 16)
                      .replace("T", " ")}
                  </td>
                  <td>{item.shipmentStatus}</td>
                  {item.shipmentStatus !== CANCELLED ? (
                    <td
                      className="cancel-shipment"
                      onClick={() => {
                        handleShipmentClicked(item);
                      }}
                    >
                      <FontAwesomeIcon size="lg" color={"red"} icon={faTimes} />
                    </td>
                  ) : (
                    <td className="cancel-shipment"></td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <>
          <h1>You have no shipments.</h1>

          <table className="styled-table">
            <thead>
              <tr>
                <th>Receiver</th>
                <th>Weight</th>
                <th>Color</th>
                <th>Price</th>
                <th>Destination</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "none", cursor: "none" }}>
                <td></td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default Table;

import React, { useEffect, useRef, useState } from "react";
import { getAllShipments } from "../../api/shipments";
import { useAuth } from "../../context/auth";
import PrivateLayout from "../../layouts/PrivateLayout";
import "./style.scss";

// active-row on tr based in active id.;
// highlighta senaste shipment och lägg till confetti...

// Hämta alla shipments för nuvarande användare vid useEffect

// När användaren klickar skall det komma en modal som frågar om de vill avbryta sin order,
// om de gör, kalla backend och ändra status på användarens shipment och uppdatera state med det nya..

// fixa att man inte ska ha nolla i början på register nummer, kolla "validate",
// se också till att inget landskod börjar på 0.

const UserShipmentDetailsPage = () => {
  const { getUserToken } = useAuth();

  const [shipments, setShipments] = useState([
    {
      id: 1,
      receiver: "Aman",
      weight: 5,
      color: "Red",
      price: 23,
      destination: "Sweden",
      date: "2020-01-24",
      status: "IN_TRANSIT",
    },
    {
      id: 2,
      receiver: "Amir",
      weight: 2,
      color: "Blue",
      price: 13,
      destination: "Denmark",
      date: "2020-05-24",
      status: "PACKING",
    },
    {
      id: 3,
      receiver: "Amir",
      weight: 2,
      color: "Blue",
      price: 13,
      destination: "Denmark",
      date: "2020-05-24",
      status: "PACKING",
    },
  ]);

  const [selectedShipment, setSelectedShipment] = useState(null);

  const handleShipmentClicked = (clickedShipment) => {
    console.log(clickedShipment);
    setSelectedShipment(clickedShipment);
  };

  const renderUserShipments = async () => {
    try {
      const token = await getUserToken();
      const response = await getAllShipments(token);

      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    renderUserShipments();
  }, []);

  return (
    <PrivateLayout>
      <div className="shipment-details-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Receiver</th>
              <th>Weight</th>
              <th>Color</th>
              <th>Price</th>
              <th>Destination</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((item) => (
              <tr
                onClick={() => {
                  handleShipmentClicked(item);
                }}
                className={
                  selectedShipment && item.id === selectedShipment.id
                    ? "active-row"
                    : ""
                }
                key={item.id}
              >
                <td>{item.receiver}</td>
                <td>{item.weight}</td>
                <td>{item.color}</td>
                <td>{item.price}</td>
                <td>{item.destination}</td>
                <td>{item.date}</td>
                <td>
                  <div style={{ position: "relative" }}>
                    {item.status}
                    {item.id === 1 && (
                      <p
                        style={{
                          position: "absolute",
                          top: "0",
                          left: "110px",
                        }}
                      >
                        star ikon här dvs id = location.claimS.id
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PrivateLayout>
  );
};

export default UserShipmentDetailsPage;

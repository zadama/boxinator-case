import React, { useEffect, useRef, useState } from "react";
import { getAllCountries } from "../../api/countries";
import { getAllShipments } from "../../api/shipments";
import PageLoader from "../../components/loader";
import Modal from "../../components/modal";
import { useAuth } from "../../context/auth";
import PrivateLayout from "../../layouts/PrivateLayout";
import Table from "./components/Table";
import "./style.scss";
import { updateShipment } from "../../api/shipments";
import Alert from "../../components/alert";
import { CANCELLED } from "../../utils/shipmentStatusValues";

import Confetti from "react-confetti";

// active-row on tr based in active id.;
// highlighta senaste shipment och lägg till confetti...

// Hämta alla shipments för nuvarande användare vid useEffect

// När användaren klickar skall det komma en modal som frågar om de vill avbryta sin order,
// om de gör, kalla backend och ändra status på användarens shipment och uppdatera state med det nya..

// fixa att man inte ska ha nolla i början på register nummer, kolla "validate",
// se också till att inget landskod börjar på 0.

const UserShipmentDetailsPage = ({ location, history }) => {
  const { getUserToken } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [shipments, setShipments] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const [selectedShipment, setSelectedShipment] = useState(null);

  const handleShipmentClicked = (clickedShipment) => {
    setSelectedShipment(clickedShipment);
    setConfirmModal(true);
  };

  const renderUserShipments = async () => {
    try {
      const token = await getUserToken();
      //const countries = await getAllCountries(token);
      const { data: result } = await getAllShipments(token);
      const shipmentData = result.data;
      console.log(shipmentData);

      // Filters all objects that only have destinationCountry Id and not full object.
      // Adds to it destinationCountry that already exists among received data from backend.

      setShipments(result.data);
    } catch (error) {
      console.log(error);
      setAlert({
        message: "Could not fetch your shipments. Please try again later.",
        variant: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelShipment = async () => {
    setConfirmModal(false);
    setIsLoading(true);
    try {
      const token = await getUserToken();
      await updateShipment(
        selectedShipment.id,
        {
          shipmentStatus: CANCELLED,
        },
        token
      );
      await renderUserShipments();
    } catch (error) {
      setAlert({
        message: "Could not cancel shipment. Please try again later.",
        variant: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      location &&
      location.state &&
      location.state.claimShipment &&
      location.state.date
    ) {
      const diff = new Date().getTime() - location.state.date.getTime();
      const secondsSinceArrival = Math.floor(diff / 1000);

      if (secondsSinceArrival <= 4) {
        setAlert({
          message: "Shipment was successfully added!",
          variant: "success",
        });
        setShowConfetti(true);
      }
    }

    renderUserShipments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PrivateLayout>
      <div className="shipment-details-container">
        {alert && (
          <Alert
            message={alert.message}
            onClose={() => {
              setAlert(null);
            }}
            variant={alert.variant}
            expire={3000}
          />
        )}

        {showConfetti && <Confetti recycle={false} />}

        {confirmModal && (
          <Modal
            onClose={() => {
              setConfirmModal(false);
            }}
          >
            <div className="cancel-container">
              <h1>Shipment</h1>

              <p>Are you sure you want to cancel the shipment?</p>
              <button
                className="btn btn-action"
                style={{ backgroundColor: "darkred" }}
                onClick={cancelShipment}
              >
                Yes, cancel my shipment!
              </button>
            </div>
          </Modal>
        )}

        {isLoading ? (
          <PageLoader />
        ) : (
          <Table
            shipments={shipments}
            handleShipmentClicked={handleShipmentClicked}
            selectedShipment={selectedShipment}
          />
        )}
      </div>
    </PrivateLayout>
  );
};

export default UserShipmentDetailsPage;

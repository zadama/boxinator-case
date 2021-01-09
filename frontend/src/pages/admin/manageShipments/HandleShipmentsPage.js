import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/auth";
import Toaster from "../../../components/toast/Toaster";
import {
  updateShipment,
  deleteShipment,
  getAllShipments,
} from "../../../api/shipments";
import Search from "../../../components/search/Search";
import ShipmentList from "./ShipmentList";
import "./styles.scss";

const HandleShipmentsPage = (props) => {
  const auth = useAuth();
  const firstUpdate = useRef(true);
  const [isLoading, setIsLoading] = useState(false);

  //For Toaster component
  const [toastHeader, setToastHeader] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [toast, setToast] = useState(false);

  const [shipments, setShipments] = useState([]);
  const [shipmentList, setShipmentList] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      renderShipmentData();
      return;
    } else {
      const filtered = shipments.filter((shipment) => {
        return (
          shipment.id + "" === searchValue ||
          shipment.shipmentStatus
            .toUpperCase()
            .includes(searchValue.toUpperCase())
        );
      });
      setShipmentList(filtered);
    }
  }, [searchValue]);

  const renderShipmentData = async () => {
    setIsLoading(true);
    try {
      const token = await auth.getUserToken();
      let response = await getAllShipments(token);
      let { data: savedShipments } = response.data;
      savedShipments = savedShipments
        .sort(function (a, b) {
          return a.id - b.id;
        })
        .map((shipment) => {
          return {
            id: shipment.id,
            account: shipment.account,
            receiver: shipment.receiver,
            weight: shipment.weight,
            boxColour: shipment.boxColour,
            shipmentStatus: shipment.shipmentStatus,
            destinationCountry: shipment.destinationCountry,
            sourceCountry: shipment.sourceCountry,
          };
        });
      setShipments(savedShipments);
      setShipmentList(savedShipments);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdateShipment = async (shipment) => {
    setIsLoading(true);
    const { shipment_id, account_id, id, ...rest } = shipment;
    try {
      const token = await auth.getUserToken();
      await updateShipment(shipment_id, { ...rest }, token);
      setToastHeader("Success");
      setToastMsg("Shipment record was updated successfully.");
      setToast(true);
      renderShipmentData();
    } catch (error) {
      setToastHeader("Error");
      setToastMsg("Unable to update shipment record details.");
      setToast(true);
    } finally {
      setIsLoading(false);
      await renderShipmentData();
    }
  };

  const onDeleteShipment = async (shipment_id) => {
    setIsLoading(true);
    try {
      const token = await auth.getUserToken();
      await deleteShipment(shipment_id, token);
      setToastHeader("Success");
      setToastMsg("Shipment record was deleted successfully.");
      setToast(true);
      renderShipmentData();
    } catch (error) {
      setToastHeader("Error");
      setToastMsg("Unable to delete shipment record details.");
      setToast(true);
    } finally {
      setIsLoading(false);
      await renderShipmentData();
    }
  };

  return (
    <>
      {toast && (
        <Toaster
          toastHeaderMsg={toastHeader}
          toastMsg={toastMsg}
          onClose={() => {
            setToast(false);
          }}
        />
      )}
      <div>
        <Search setSearchValue={setSearchValue} type={props.searchterms} />
      </div>

      <div className="all-shipments-container">
        <div className="row shipment-table-header">
          <h4>All Shipment History</h4>
        </div>

        <ShipmentList
          isLoading={isLoading}
          shipmentList={shipmentList}
          updateShipment={onUpdateShipment}
          deleteShipment={onDeleteShipment}
        />
      </div>
    </>
  );
};

export default HandleShipmentsPage;

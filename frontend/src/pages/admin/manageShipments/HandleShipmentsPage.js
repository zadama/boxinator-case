import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/auth";
import Toaster from "../../../components/toast/Toaster";
import {updateShipment, deleteShipment, getAllShipments} from "../../../api/shipments";
import Search from "../../../components/search/Search";

import ShipmentList from "./ShipmentList";

import "./styles.scss";

const HandleShipmentsPage = () => {

  const auth = useAuth();
  const firstUpdate = useRef(true);
  const [editShipmentView, setEditShipmentView] = useState(false);
  const [deleteShipmentView, setDeleteShipmentView] = useState(false);
  //const [thisShipment, setThisShipment] = useState(null);

  const [toastHeader, setToastHeader] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [toast, setToast] = useState(false);

  const [shipments, setShipments] = useState([]);
  const [shipmentList,setShipmentList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  

  useEffect( () => {
    if (firstUpdate.current) {
     firstUpdate.current = false;
     renderShipmentData();
     return;
   } else {
     const filtered = shipments.filter( shipment => {
       return (
           (shipment.id + "") === searchValue || 
           shipment.shipmentStatus.toUpperCase().includes(searchValue.toUpperCase())
       );
     });
     setShipmentList(filtered);
   }
   
 },[searchValue]);

  const renderShipmentData = async () => {
    try {
      const token = await auth.getUserToken(); 
      let response =  await getAllShipments(token);
      let {data: savedShipments} = response.data;
      console.log(response)
      savedShipments = savedShipments
      .sort(function (a, b) {
        return a.id - b.id
      }).map((shipment) => {
        console.log(shipment);
        return {
            id: shipment.id,
            account: shipment.account,
            receiver: shipment.receiver,
            weight: shipment.weight,
            boxColour: shipment.boxColour,
            shipmentStatus: shipment.shipmentStatus,
            destinationCountry: shipment.destinationCountry.name,
            sourceCountry: shipment.sourceCountry

        };
      });
      console.log(savedShipments);
      setShipments(savedShipments);
      setShipmentList(savedShipments);
    }
    catch(error){
      console.log(error);

    }
  }

  const onUpdateShipment = async (shipment) => {
    try {
      const token = await auth.getUserToken(); 
      await updateShipment(shipment, token);
      setToastHeader("Success");
      setToastMsg("Shipment record was updated successfully.");
      setToast(true);
      renderShipmentData();
    } catch (error) {
      console.log(error, "Unable to update shipment");
      setToastHeader("Error");
      setToastMsg("Unable to update shipment record details.");
      setToast(true);
    } 
  }

  const onDeleteShipment = async (shipment_id) => {
    try {
      const token = await auth.getUserToken();
      await deleteShipment(shipment_id, token);
      setToastMsg("Shipment record was deleted successfully.");
      setToast(true);
      renderShipmentData();
    } catch(error) {
      console.log(error, "Unable to delete shipment.");
      setToastHeader("Error");
      setToastMsg("Unable to delete shipment record details.");
      setToast(true);
    }
  }
/*
  const handleEditClick = (shipment) => {
    setEditShipmentView(!editShipmentView);
    //setThisShipment(shipment);
  }

  const handleDeleteClick = (shipment) => {
    setDeleteShipmentView(!deleteShipmentView);
    //setThisShipment(shipment);
  }
*/

    return (
      <>
      {shipments == null ? <div>
        No shipments found! 
      </div>
    :  
    <>
    <div>
    {toast && <Toaster toastHeaderMsg={toastHeader} toastMsg={toastMsg} onClose={() => {
                setToast(false);
            }}/>}
    </div>

    <div>
      <Search setSearchValue={setSearchValue}/>
    </div>

      <div className="all-shipments-container">
        <div className="row shipment-table-header">
          <h3>All Shipment History</h3>
        </div> 
          {<ShipmentList 
              shipmentList={shipmentList}
              updateShipment={onUpdateShipment} 
              deleteShipment={onDeleteShipment}
              >
            </ShipmentList>}
      </div>
      </>
    }
      </>
    );
  };
  
export default HandleShipmentsPage;

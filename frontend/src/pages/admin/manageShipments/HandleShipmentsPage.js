import React from "react";
import "../style.scss";
import { useAuth } from "../../../context/auth";
import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import {getAllShipments} from "../../../api/shipments";
import { Button } from "react-bootstrap";
import EditShipmentModal from "./EditShipmentModal";
import Toaster from "../../../components/toast/Toaster";
import {updateShipment, deleteShipment} from "../../../api/shipments";


import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilAlt, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import DeleteShipmentModal from "./DeleteShipmentModal";

const HandleShipmentsPage = () => {

  const auth = useAuth();
  const [editShipmentView, setEditShipmentView] = useState(false);
  const [deleteShipmentView, setDeleteShipmentView] = useState(false);
  const [result, setResult] = useState(null);
  const [thisShipment, setThisShipment] = useState(null);

  const [toastHeader, setToastHeader] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [toast, setToast] = useState(false);
  
  const renderShipmentData = async () => {
    try {
      const token = await auth.getUserToken(); 
      const response =  await getAllShipments(token);
      const {data} = response.data;
      setResult(data);
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

  const handleEditClick = (item) => {
    setEditShipmentView(!editShipmentView);
    setThisShipment(item);
  }

  const handleDeleteClick = (item) => {
    setDeleteShipmentView(!deleteShipmentView);
    setThisShipment(item);
  }
  
  useEffect(( ) => {
    renderShipmentData();
  },[])

    return (
      <>
      {result == null ? <div>
        No shipments found! 
      </div>
    :  
    <>
    <div>
    {toast && <Toaster toastHeaderMsg={toastHeader} toastMsg={toastMsg} onClose={() => {
                setToast(false);
            }}/>}
    </div>

    <div className="searchShipment-Container">
     
     </div>

      <div className="displayAllShipment-Container">
      <h3>All Shipment History</h3>
      <Table>
          <thead>
          <tr>
          <th>Shipment Id</th>
         <th>Account</th> 
          <th>Receiver</th>
          <th>Weight</th>
          <th>Box Colour</th>
          <th>Shipment Status</th>
           <th>Destination Country</th> 
          <th>Source Country</th>
          <th>Edit/Delete</th>
          </tr>
          </thead>
          <tbody>
            {result.map(function(item){
              return (<tr key={item.id}>
                <td>{item.id}</td>
              <td><a href="#">{item.account.firstName} {item.account.lastName}</a></td> 
              <td>{item.receiver}</td>
              <td>{item.weight}</td>
              <td>{item.boxColour}</td>
              <td>{item.shipmentStatus}</td>
              <td>{item.destinationCountry.name}</td> 
              <td>{item.sourceCountry}</td>
              <td>
                <Button variant="primary btn-sm"
                  onClick={()=> handleEditClick(item)}>
                    <FontAwesomeIcon icon={faPencilAlt}/>
                </Button> 
              <Button variant="danger btn-sm ml-2" onClick={() => handleDeleteClick(item)}><FontAwesomeIcon icon={faTrashAlt}/></Button>
              </td>
              </tr>)
            })}
              </tbody>            
      </Table>
      {editShipmentView && <EditShipmentModal thisShipment={thisShipment} updateShipment={onUpdateShipment} onClose={() => setEditShipmentView(!editShipmentView)}></EditShipmentModal>}
      {deleteShipmentView && <DeleteShipmentModal thisShipment={thisShipment} deleteShipment={onDeleteShipment} onClose={() => setDeleteShipmentView(!deleteShipmentView)} ></DeleteShipmentModal>}
      </div>  
      </>
    }

     
      </>
    );
  };
  
export default HandleShipmentsPage;

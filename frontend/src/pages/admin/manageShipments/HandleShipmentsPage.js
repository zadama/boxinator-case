import React from "react";
import "../style.scss";
import { useAuth } from "../../../context/auth";
import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import {getAllShipments} from "../../../api/shipments";
import { Button } from "react-bootstrap";
import EditShipmentModal from "./EditShipmentModal";
import Toaster from "../../../components/toast/Toaster";
import {updateShipment} from "../../../api/shipments";


import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilAlt, faTrashAlt} from "@fortawesome/free-solid-svg-icons";

const HandleShipmentsPage = () => {

  const auth = useAuth();
  const [editShipmentView, setEditShipmentView] = useState(false);
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
      console.log(data);
      setResult(data);
    }
  
    catch(error){
      console.log(error);
    }
  }

  const onUpdateShipmentClicked = async (shipment) => {
    console.log(shipment);
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

  const handleEditClick = (item) => {
    setEditShipmentView(!editShipmentView);
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
                <Button variant="primary"
                  onClick={()=> handleEditClick(item)}>
                    <FontAwesomeIcon icon={faPencilAlt}/>
                </Button> 
              <Button variant="danger ml-2"><FontAwesomeIcon icon={faTrashAlt}/></Button>
              </td>
              </tr>)
            })}
              </tbody>            
      </Table>
      {editShipmentView && <EditShipmentModal thisShipment={thisShipment} updateShipment={onUpdateShipmentClicked} onClose={() => setEditShipmentView(!editShipmentView)}></EditShipmentModal>}
      </div>  
      </>
    }

     
      </>
    );
  };
  
export default HandleShipmentsPage;

import React from "react";
import "./style.scss";
import { useAuth } from "../../context/auth";
import PrivateLayout from "../../layouts/PrivateLayout";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Table from "react-bootstrap/Table";
import {getAllShipments} from "../../api/shipments";

const HandleShipmentsPage = () => {
  const {getUserToken} = useAuth();
  const [result, setResult] = useState(null);
  const renderShipmentData = async () => {
    try {
      const token = await getUserToken();
      const response =  await getAllShipments(token);
      const {data} = response.data;
      console.log(data);
      setResult(data);
    }
  
    catch(error){
      console.log(error);
    }
  }
  
  useEffect(( ) => {
    renderShipmentData();
  },[])

    return (
      <>
      <Navbar></Navbar>
      {result == null ? <div>
        loading...
      </div>
    :  
    <>
    <h3>Shipments</h3>
    <div className="searchShipment-Container">
     <h3>Search Shipments</h3>
     <input placeholder="Search by shipment id..."></input>
     </div>

      <div className="displayAllShipment-Container">
      <h3>All Shipment History</h3>
      <Table>
          <thead>
          <tr>
          <th>Shipment Id</th>
       {/*   <th>Account Id</th> */}
          <th>Receiver</th>
          <th>Weight</th>
          <th>Box Colour</th>
          <th>Shipment Status</th>
          <th>Destination Country</th>
          <th>Source Country</th>
          <th>Edit</th>
          </tr>
          </thead>
          <tbody>
            {result.map(function(item){
              return (<tr key={item.id}>
                <td>{item.id}</td>
         {/*       <td>{item.account.id}</td> */}
              <td>{item.receiver}</td>
              <td>{item.weight}</td>
              <td>{item.boxColour}</td>
              <td>{item.shipmentStatus}</td>
              <td>{item.destinationCountry}</td>
              <td>{item.sourceCountry}</td>
              <td><button>Edit</button> <button>Delete</button></td>
              </tr>)
            })}
              </tbody>            
      </Table>
      </div>  
      </>
    }

     
      </>
    );
  };
  
export default HandleShipmentsPage;

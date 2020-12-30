import React, { useState, useEffect } from 'react';
import {useAuth} from "../../../context/auth";
import Modal from '../../../components/modal/index';
import {getAllCountries} from "../../../api/countries";
import EditShipmentForm from './EditShipmentForm';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilAlt} from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";


const EditShipmentModal = (props) => {
  
  const auth = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [countries, setCountries] = useState([]);

 useEffect( () => {
   getCountries();
 }, []); 

  const getCountries = async () => {
    try {
      const token = await auth.getUserToken();
      let response = await getAllCountries(token);
      let {data: savedCountries} = response.data;
      savedCountries = savedCountries.map((country) => {
        return {
          id: country.id,
          name: country.name,
        };
      });
      setCountries(savedCountries);
    } catch(error) {
      console.log(error, "Unable to get countries.");
    }
  };

  const updateShipment = (shipment) => {
    props.updateShipment(shipment);
    setShowModal(false);
  }

  const onClose = () => {
    setShowModal(false);
  }

  return (
    <div>
      <Button onClick={ () => {
        setShowModal(true);
      }} className="btn btn-info btn-sm ml-2 mt-0"><FontAwesomeIcon icon={faPencilAlt}/></Button>
    
    {showModal && (<Modal onClose={onClose}>
       <EditShipmentForm onClose={onClose} shipment={props.shipment} updateShipment={updateShipment} countries={countries}/>
    </Modal>)}
    </div>
  );

};

export default EditShipmentModal;
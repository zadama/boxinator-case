import React, { useState, useEffect } from 'react';
import {useAuth} from "../../../context/auth";
import Modal from '../../../components/modal/index';
import {getAllCountries} from "../../../api/countries";
import EditShipmentForm from './EditShipmentForm';

const EditShipmentModal = (props) => {
  
  const auth = useAuth();
  const [showModal, setShowModal] = useState(true);
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
    console.log(props);
    props.updateShipment(shipment);
    setShowModal(false);
  }

  const onClose = () => {
    setShowModal(false);
    props.onClose();
  }

  return (
    <div className="container">
    {showModal && (<Modal onClose={onClose}>
       <EditShipmentForm onClose={onClose} thisShipment={props.thisShipment} updateShipment={updateShipment} countries={countries}/>
    </Modal>)}
    </div>
  );

};

export default EditShipmentModal;
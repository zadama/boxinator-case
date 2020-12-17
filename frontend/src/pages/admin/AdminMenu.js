import React from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";

const AdminMenu = props => {

  const [showAccounts, setShowAccounts] = useState(false);
  const [showCountries, setShowCountries] = useState(false);
  const [showShipments, setShowShipments] = useState(false);

  const getAccountList = () => {
    setShowAccounts(!showAccounts);
    props.getDetails(showAccounts, "accounts");
  }

  const getCountryList = () => {
    setShowCountries(!showCountries);
    props.getDetails(showCountries, "countries")
  }
  
  const getShipmentList = () => {
    setShowShipments(!showShipments);
    props.getDetails(showShipments, "shipments");
  }

  return (
    <>
      <Button onClick={getShipmentList}>Shipments</Button>
      <Button onClick={getCountryList}>Countries</Button>
      <Button onClick={getAccountList}>User details</Button>
    </>
  );
};

export default AdminMenu;

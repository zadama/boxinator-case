import { Button } from "react-bootstrap";
import React from "react";
import { useState } from "react";

const AdminMenu = props => {

  const [showAccounts, setShowAccounts] = useState(false);
  const [showShipments, setShowShipments] = useState(false);
  const [showCountries, setShowCountries] = useState(false);

  const getAccountList = () => {
    setShowAccounts(!showAccounts);
    props.getDetails(showAccounts, "accounts");
  }

  const getShipmentList = () => {
    setShowShipments(!showShipments);
    props.getDetails(showShipments, "shipments");
  }

  const getCountryList = () => {
    setShowCountries(!showCountries);
    props.getDetails(showCountries, "countries")
  }

  return (
    <>
      <Button variant="link" onClick={getAccountList}>Customer Accounts</Button>
      <Button variant="link" onClick={getShipmentList}>Shipments</Button>
      <Button variant="link" onClick={getCountryList}>Shipping Countries</Button>
    </>
  );
};

export default AdminMenu;

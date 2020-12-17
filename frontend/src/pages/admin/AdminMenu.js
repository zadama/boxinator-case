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
      <button type="button" className="btn btn-link" onClick={getAccountList}>Customer Accounts</button>
      <button type="button" className="btn btn-link" onClick={getShipmentList}>Shipments</button>
      <button type="button" className="btn btn-link" onClick={getCountryList}>Shipping Countries</button>
    </>
  );
};

export default AdminMenu;

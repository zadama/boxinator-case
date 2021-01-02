import { Button } from "react-bootstrap";
import React from "react";
import { useState } from "react";

import Location from "../../assets/location.png";
import Employee from "../../assets/employee.png";
import Box from "../../assets/box.png";

const AdminMenu = (props) => {
  const [showAccounts, setShowAccounts] = useState(false);
  const [showShipments, setShowShipments] = useState(false);
  const [showCountries, setShowCountries] = useState(false);

  const getAccountList = () => {
    setShowAccounts(!showAccounts);
    props.getDetails(showAccounts, "accounts");
  };

  const getShipmentList = () => {
    setShowShipments(!showShipments);
    props.getDetails(showShipments, "shipments");
  };

  const getCountryList = () => {
    setShowCountries(!showCountries);
    props.getDetails(showCountries, "countries");
  };

  return (
    <>
      <div className="admin-navlinks">
        <img src={Employee} alt="customers"></img>
        <Button variant="link" onClick={getAccountList}>
          Customer Accounts
        </Button>
      </div>
      <div className="admin-navlinks">
        <img src={Box} alt="shipments"></img>

        <Button variant="link" onClick={getShipmentList}>
          Shipments
        </Button>
      </div>
      <div className="admin-navlinks">
        <img src={Location} alt="location"></img>

        <Button variant="link" onClick={getCountryList}>
          Shipping Countries
        </Button>
      </div>
    </>
  );
};

export default AdminMenu;

import { Button } from "react-bootstrap";
import React from "react";
import { useState } from "react";

const ProfileMenu = props => {

  const [showProfile, setShowProfile] = useState(false);
  const [showShipments, setShowShipments] = useState(false);

  const getProfileInformation = () => {
    setShowProfile(!showProfile);
    props.getDetails(showProfile, "profile");
  }

  const getShipmentList = () => {
    setShowShipments(!showShipments);
    props.getDetails(showShipments, "shipments");
  }

  return (
    <>
      <Button variant="link" onClick={getProfileInformation}>My Profile Information</Button>
      <Button variant="link" onClick={getShipmentList}>My Shipments</Button>
    </>
  );
};

export default ProfileMenu;
import React from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";

const Sidebar = props => {

  const [showUsers, setShowUsers] = useState(false);

  const getUserDetails = () => {
    setShowUsers(!showUsers);
    props.getDetails(showUsers);
  }

  return (
    <>
      <Button>Shipments</Button>

      <Button>Countries</Button>
      <Button onClick={getUserDetails}>User details</Button>
    </>
  );
};

export default Sidebar;

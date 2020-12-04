import React from "react";
import PrivateLayout from "../../layouts/PrivateLayout";
import Button from "react-bootstrap/Button";
import { useAuth } from "../../context/auth";

const AddShipmentPage = ({ history }) => {
  const { logout } = useAuth();
  return (
    <PrivateLayout>
      <Button
        onClick={async () => {
          await logout();
          history.replace("/login");
        }}
      >
        Logout
      </Button>
      <div>AddShipmentPage </div>
    </PrivateLayout>
  );
};

export default AddShipmentPage;

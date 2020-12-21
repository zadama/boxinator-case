import React from "react";
import { Alert } from "react-bootstrap";

const AlertNotification = ({ onClose, message, variant }) => {
  return (
    <Alert
      style={{
        position: "fixed",
        top: "20px",
        left: "40%",
        zIndex: "1000",
      }}
      variant={variant}
      onClose={onClose}
    >
      {message}
    </Alert>
  );
};

export default AlertNotification;

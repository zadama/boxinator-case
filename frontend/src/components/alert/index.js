import React, { useEffect } from "react";
import { Alert } from "react-bootstrap";

const AlertNotification = ({ onClose, message, variant, expire }) => {
  useEffect(() => {
    if (expire) {
      setTimeout(() => {
        console.log("Calling close...");
        onClose();
      }, expire);
    }
  }, [expire]);

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

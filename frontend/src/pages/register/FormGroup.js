import React from "react";
import Form from "react-bootstrap/Form";

const FormGroup = ({ handleChange, value, name, placeholder, children }) => {
  return (
    <Form.Group>
      <Form.Label>Enter {name}</Form.Label>
      <Form.Control
        onChange={handleChange}
        value={value}
        name={name}
        type={name}
        placeholder={placeholder}
      />
      {children}
    </Form.Group>
  );
};

export default FormGroup;

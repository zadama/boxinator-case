import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";

import "../style.scss";
import Modal from "../../../components/modal";

const LoginAnon = ({ handleLogin, onClose }) => {
  const { register, handleSubmit, errors } = useForm();

  return (
    <Modal onClose={onClose}>
      <div style={{ paddingTop: "20px" }} className="login">
        <p>
          You can create shipments as guest user, provided that you enter your
          email.
        </p>
        <p>
          When a new shipment is created, we will send a receipt to you email on
          which you can sign up and claim the shipment.
        </p>
        <form
          style={{ marginBottom: "0px" }}
          className="form"
          onSubmit={handleSubmit(handleLogin)}
        >
          <div className="custom-form-group">
            <label className="label">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="input"
              name="email"
              ref={register({
                required: true,
                pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
              })}
            ></input>

            {errors.email && <span className="error-span">Invalid Email</span>}

            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </div>

          <Button className="btn" variant="primary" type="submit">
            Sign in Anonymously
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default LoginAnon;

import React, { useState } from "react";
import Modal from "../../../components/modal";

const LoginAnon = ({ handleLogin, onClose }) => {
  const [email, setEmail] = useState("");

  return (
    <Modal onClose={onClose}>
      <h3>Login anon</h3>

      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />

      <button
        onClick={() => {
          handleLogin(email);
        }}
      >
        Sign in
      </button>
    </Modal>
  );
};

export default LoginAnon;

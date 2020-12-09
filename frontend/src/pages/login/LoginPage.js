import React from "react";
import "./style.scss";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import PublicLayout from "../../layouts/PublicLayout";
import { getAllAccounts, createUser } from "../../api/user";
import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../../context/auth";
import { Redirect } from "react-router-dom";
import { ADMIN, USER } from "../../utils/roles";
import PageLoader from "../../components/loader";

import firebase from "../../context/firebase";
import Modal from "../../components/modal/LoginModal";
import { useRef } from "react";

const LoginPage = ({ history }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const resolverRef = useRef();

  const handleLogin = async (e) => {
    // setIsLoading(true);

    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);

      alert("User without 2 factor not allowed....");
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        //....
        setErrorMessage("Could not login: " + error.code);
      }

      if (error.code === "auth/multi-factor-auth-required") {
        // The user is enrolled in MFA, must be verified
        resolverRef.current = error.resolver;
        setShowModal(true);
      }
    } finally {
      //setIsLoading(false);
    }
  };

  if (user === null || isLoading) {
    return <PageLoader />;
  }

  if (user && user.role === ADMIN) {
    return <Redirect to="admin-dashboard" />;
  }
  if (user && user.role === USER) {
    return <Redirect to="add-shipment" />;
  }

  return (
    <PublicLayout>
      {showModal && (
        <Modal
          firebase={firebase}
          resolver={resolverRef.current}
          onClose={() => {
            setShowModal(false);
          }}
        ></Modal>
      )}

      <div className="login">
        {errorMessage}

        <div className="form">
          <div className="custom-form-group">
            <label className="label">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            ></input>

            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </div>

          <div className="custom-form-group">
            <label className="label">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            ></input>
          </div>
          <Button
            className="btn"
            onClick={handleLogin}
            variant="primary"
            type="submit"
          >
            Login
          </Button>
        </div>
      </div>
    </PublicLayout>
  );
};

export default LoginPage;

import React from "react";
import { useForm } from "react-hook-form";

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
import Alert from "../../components/alert";
import { useRef } from "react";
import { AuthErrorHandling } from "../../utils/authErrors";

const LoginPage = ({ history }) => {
  const { register, handleSubmit, watch, errors } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();

  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const resolverRef = useRef();

  const handleLogin = async (data) => {
    // setIsLoading(true);

    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(data.email, data.password);

      alert("User without 2 factor not allowed....");
    } catch (error) {
      const errorHandler = AuthErrorHandling[error.code];

      if (errorHandler != null) {
        setErrorMessage(errorHandler.response);
        // After 3 seconds, remove the error message
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      }

      if (error.code === "auth/multi-factor-auth-required") {
        // The user is enrolled in MFA, must be verified
        resolverRef.current = error.resolver;
        setShowModal(true);
      }
    }
  };

  if (user === null || isLoading) {
    return <PageLoader />;
  }

  if (user && user.role === ADMIN) {
    return <Redirect to="/admin-dashboard" />;
  }
  if (user && user.role === USER) {
    return <Redirect to="/add-shipment" />;
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
        {errorMessage && (
          <Alert
            message={errorMessage}
            onClose={() => {
              setErrorMessage("");
            }}
            variant={"danger"}
          />
        )}

        <form className="form" onSubmit={handleSubmit(handleLogin)}>
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

          <div className="custom-form-group">
            <label className="label">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="input"
              name="password"
              ref={register({
                required: true,
                minLength: {
                  value: 6,
                  message: "Password should be at-least 6 characters.",
                },
              })}
            ></input>
            {errors.password && (
              <span className="error-span">
                {errors.password.message
                  ? errors.password.message
                  : "Invalid Password"}
              </span>
            )}
          </div>
          <Button className="btn" variant="primary" type="submit">
            Login
          </Button>
        </form>
      </div>
    </PublicLayout>
  );
};

export default LoginPage;

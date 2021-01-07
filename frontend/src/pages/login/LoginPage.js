import React, { useState, useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";

import "./style.scss";
import PublicLayout from "../../layouts/PublicLayout";

import { useAuth } from "../../context/auth";
import { ADMIN, GUEST, USER } from "../../utils/roles";
import firebase from "../../context/firebase";
import { AuthErrorHandling } from "../../utils/authErrors";

import LoginForm from "./components/LoginForm";
import Login2fa from "./components/Login2Fa";
import PageLoader from "../../components/loader";
import Alert from "../../components/alert";
import LoginAnon from "./components/LoginAnon";

const LoginPage = ({ history }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, login, loginAnonymously } = useAuth();

  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAnonModal, setShowAnonModal] = useState(false);
  const resolverRef = useRef();

  const handleErrorMessage = (message) => {
    setErrorMessage(message);
  };

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
        handleErrorMessage(errorHandler.response);
      }

      if (error.code === "auth/multi-factor-auth-required") {
        // The user is enrolled in MFA, must be verified
        resolverRef.current = error.resolver;
        setShowModal(true);
      }
    }
  };

  const handleAnonLogin = async (data) => {
    try {
      await loginAnonymously(data.email.toLowerCase());
    } catch (error) {
      if (error.response.status === 409) {
        // After 3 seconds, remove the error message
        handleErrorMessage("Email already in use. ");
      }
    }
  };

  if (user === null || isLoading) {
    return <PageLoader />;
  }

  if (user && user.role === ADMIN) {
    return <Redirect to="/admin-dashboard" />;
  }
  if (user && (user.role === USER || user.role === GUEST)) {
    return <Redirect to="/add-shipment" />;
  }

  return (
    <PublicLayout>
      {showModal && (
        <Login2fa
          firebase={firebase}
          resolver={resolverRef.current}
          onClose={() => {
            setShowModal(false);
          }}
        />
      )}

      {showAnonModal && (
        <LoginAnon
          handleLogin={handleAnonLogin}
          onClose={() => {
            setShowAnonModal(false);
          }}
        />
      )}

      <div className="login">
        {errorMessage && (
          <Alert
            message={errorMessage}
            onClose={() => {
              setErrorMessage("");
            }}
            variant={"danger"}
            expire={3000}
          />
        )}

        <LoginForm handleLogin={handleLogin} />

        <div className="anon-sign-in">
          <p>Don't want to sign up right away?</p>
          <button
            onClick={() => {
              setShowAnonModal(true);
            }}
          >
            Sign in as a Guest
          </button>
        </div>
      </div>
    </PublicLayout>
  );
};

export default LoginPage;

import React, { useState, useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";

import "./style.scss";
import PublicLayout from "../../layouts/PublicLayout";

import { useAuth } from "../../context/auth";
import { ADMIN, GUEST, USER } from "../../utils/roles";
import { AuthErrorHandling } from "../../utils/authErrors";
import firebase from "../../context/firebase";

import { createUser } from "../../api/user";
import { getAllCountries } from "../../api/countries";

import PageLoader from "../../components/loader";
import RegisterForm from "./components/RegisterForm";
import Enroll2FA from "./components/Enroll2FA";

const RegisterPage = ({ history }) => {
  const [isloading, setIsLoading] = useState(false);

  const [countries, setCountries] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const { user, register, reloadUser, deleteUser } = useAuth();

  const [showModal, setShowModal] = useState(false);

  const formData = useRef({});

  const handleRegistration = async (data) => {
    formData.current = data;

    try {
      await register(data.email, data.password);

      alert(
        "You need to enroll with 2-factor authentication! Verify your email before adding your number."
      );

      setShowModal(true);
    } catch (error) {
      console.log(error);
      const errorHandler = AuthErrorHandling[error.code];
      console.log(error.code);

      if (errorHandler != null) {
        setErrorMessage(errorHandler.response);

        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      }
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
      let response = await getAllCountries();
      let { data: savedCountries } = response.data;

      savedCountries = savedCountries.map((obj) => {
        return {
          label: obj.name,
          value: obj.name,
          feeMultiplier: obj.feeMultiplier,
        };
      });

      setCountries(savedCountries);
      setIsLoading(false);
    };

    fetchCountries();
  }, []);

  const onSuccess = async () => {
    console.log({ ...formData.current });

    try {
      await createUser({ ...formData.current });
      await reloadUser();

      history.replace("/add-shipment");
    } catch (error) {
      console.log(error);
      // deleteUser();
    }
  };

  // If user is null it means we are still fetching him/her
  // Therefore, show a loading spinner.
  if (user === null) {
    return <PageLoader />;
  }

  // If we already have a user logged in, it is not
  // neccessary to show this page, redirect to another
  // page depending on the role.
  if (user && user.role === ADMIN) {
    return <Redirect to="/admin-dashboard" />;
  }
  if (user && user.role === USER) {
    return <Redirect to="/add-shipment" />;
  }

  return (
    <PublicLayout>
      {showModal && (
        <Enroll2FA
          onSuccess={onSuccess}
          initialNumber={formData.current.contactNumber}
          firebase={firebase}
          onClose={() => {
            setShowModal(false);
          }}
        />
      )}

      {isloading ? (
        <PageLoader />
      ) : (
        <RegisterForm
          handleRegistration={handleRegistration}
          countries={countries}
          errorMessage={errorMessage}
          closeAlert={() => {
            setErrorMessage(false);
          }}
        />
      )}
    </PublicLayout>
  );
};

export default RegisterPage;

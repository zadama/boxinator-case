import React from "react";
import { useForm } from "react-hook-form";

import { useState } from "react";
import Select, { components } from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./style.scss";
import Button from "react-bootstrap/Button";

import PublicLayout from "../../layouts/PublicLayout";
import { useEffect } from "react";
import PageLoader from "../../components/loader";
import { getAllCountries } from "../../api/countries";
import { useAuth } from "../../context/auth";
import { ADMIN, GUEST, USER } from "../../utils/roles";
import { Redirect } from "react-router-dom";
import { createUser } from "../../api/user";

import firebase from "../../context/firebase";
import { useRef } from "react";
import Modal from "../../components/modal/RegisterModal";
import { AuthErrorHandling } from "../../utils/authErrors";
import Alert from "../../components/alert";

const { Option } = components;
const IconOption = (props) => {
  console.log(props.data);
  return (
    <Option {...props}>
      <img
        src={require("../../assets/" + props.data.label + ".svg").default}
        alt={props.data.label}
        style={{ maxWidth: "40px", marginRight: "10px" }}
      ></img>{" "}
      {props.data.label}
    </Option>
  );
};

const RegisterPage = ({ history }) => {
  const {
    register: registerForm,
    handleSubmit,
    watch,
    errors,
    getValues,
  } = useForm();

  const [isloading, setIsLoading] = useState(false);

  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [country, setCountry] = useState("");

  const [countries, setCountries] = useState([]);
  const { user, register, reloadUser, deleteUser } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /*
  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };*/

  // password should not be sent as it is already saved in firebase
  // however, uuid for user should be send and work as unique identifier in account table.

  /**
   * TA HÄNSYN TILL när användaren signar upp och "avbryter" vid 2 factorerings delen
   * han ska ej få kunna logga in (kanske en check som emailVerified, mutlifactor.något)
   * men även att användaren tas bort eller något ifall detta sker så man kan re-signa med
   * samma email.
   */

  const handleRegistration = async (data) => {
    try {
      const user = await register(data.email, data.password);

      alert(
        "You need to enroll with 2-factor authentication! Verify your email before adding your number."
      );

      setShowModal(true);
    } catch (error) {
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
    const {
      email,
      password,
      firstName,
      lastName,
      zipCode,
      contactNumber,
    } = getValues();

    try {
      await createUser(
        email,
        password,
        firstName,
        lastName,
        dateOfBirth,
        country,
        zipCode,
        contactNumber
      );
      await reloadUser();

      history.replace("/add-shipment");
    } catch (error) {
      console.log(error);
      deleteUser();
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
        <Modal
          onSuccess={onSuccess}
          initialNumber={watch("contactNumber")}
          firebase={firebase}
          onClose={() => {
            setShowModal(false);
          }}
        ></Modal>
      )}

      {isloading ? (
        <PageLoader />
      ) : (
        <form className="register" onSubmit={handleSubmit(handleRegistration)}>
          {errorMessage && (
            <Alert
              message={errorMessage}
              onClose={() => {
                setErrorMessage("");
              }}
              variant={"danger"}
            />
          )}

          <div className="register-form-group half-width">
            <label className="label">Firstname</label>
            <input
              type="text"
              name="firstName"
              placeholder="Firstname"
              className="input"
              ref={registerForm({
                required: true,
                minLength: 2,
                maxLength: 35,
              })}
              style={{ borderColor: errors.firstName && "red" }}
            ></input>
            {errors.firstName && (
              <span className="error-span">Invalid Firstname</span>
            )}
          </div>
          <div className="register-form-group half-width">
            <label className="label">Lastname</label>
            <input
              type="text"
              name="lastName"
              placeholder="Lastname"
              className="input"
              ref={registerForm({
                required: true,
                minLength: 2,
                maxLength: 35,
              })}
              style={{ borderColor: errors.lastName && "red" }}
            ></input>
            {errors.lastName && (
              <span className="error-span">Invalid Lastname</span>
            )}
          </div>

          <div className="register-form-group full-width">
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input"
              ref={registerForm({
                required: "Enter your e-mail",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Enter a valid e-mail address",
                },
              })}
              style={{ borderColor: errors.email && "red" }}
            ></input>

            {errors.email && (
              <span className="error-span">{errors.email.message}</span>
            )}
          </div>

          <div className="register-form-group half-width">
            <label className="label">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input"
              ref={registerForm({
                required: true,
                minLength: 6,
              })}
              style={{ borderColor: errors.password && "red" }}
            ></input>
            {errors.password && (
              <span className="error-span">Invalid Password</span>
            )}
          </div>

          <div className="register-form-group half-width">
            <label className="label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="input"
              ref={registerForm({
                required: true,
                minLength: 6,
                validate: (value) =>
                  value === watch("password") || "Passwords don't match.",
              })}
              style={{ borderColor: errors.confirmPassword && "red" }}
            ></input>
            {errors.confirmPassword && (
              <span className="error-span">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <div className="register-form-group half-width">
            <label className="label">Phone number</label>
            <input
              type="text"
              name="contactNumber"
              placeholder="Phone number"
              className="input"
              ref={registerForm({
                required: true,
              })}
              style={{ borderColor: errors.contactNumber && "red" }}
            ></input>
            {errors.contactNumber && (
              <span className="error-span">Invalid ContactNumber</span>
            )}
          </div>

          <div className="register-form-group half-width">
            <label className="label">Date of birth</label>
            <DatePicker
              selected={dateOfBirth}
              showYearDropdown
              maxDate={new Date()}
              placeholderText="MM/DD/YYYY"
              onChange={(date) => setDateOfBirth(date)}
              className="input"
            />
          </div>

          <div className="register-form-group half-width">
            <label className="label">Country</label>
            <Select
              className="select-picker"
              placeholder={"Select country"}
              options={countries}
              components={{ Option: IconOption }}
              onChange={(e) => {
                setCountry(e.value);
              }}
            />
          </div>

          <div className="register-form-group half-width">
            <label className="label">Zip code</label>
            <input
              type="text"
              name="zipCode"
              placeholder="Zip code"
              className="input"
              ref={registerForm({
                required: true,
                minLength: {
                  value: 4,
                  message: "Zip code must be at least 4 digits long",
                },
              })}
            ></input>
          </div>

          <Button
            className="btn register-button"
            variant="primary"
            type="submit"
          >
            Register
          </Button>
        </form>
      )}
    </PublicLayout>
  );
};

export default RegisterPage;

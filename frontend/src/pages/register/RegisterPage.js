import React from "react";
import { useState } from "react";
import Form from "react-bootstrap/Form";
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
var appVerifier = null;

const { Option } = components;
const IconOption = (props) => (
  <Option {...props}>Ikonhär -{props.data.label}</Option>
);

const RegisterPage = ({ history }) => {
  // Make a component out of the country selecter and have
  // isLoding only there.
  const [isloading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [contactNumber, setContactNumber] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [country, setCountry] = useState("");

  const [countries, setCountries] = useState([]);
  const { user, register, reloadUser, deleteUser } = useAuth();

  const [showModal, setShowModal] = useState(false);

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

  const handleRegistration = async () => {
    try {
      const user = await register(email, password);

      alert(
        "You need to enroll with 2-factor authentication! Verify your email before adding your number."
      );

      setShowModal(true);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        console.log("That email address is already in use!");
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
          firebase={firebase}
          initialNumber={contactNumber}
          onClose={() => {
            setShowModal(false);
          }}
        ></Modal>
      )}

      {isloading ? (
        <PageLoader />
      ) : (
        <div className="register">
          <div className="register-form-group half-width">
            <label className="label">Firstname</label>
            <input
              type="text"
              placeholder="Firstname"
              className="input"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            ></input>
          </div>
          <div className="register-form-group half-width">
            <label className="label">Lastname</label>
            <input
              type="text"
              placeholder="Lastname"
              className="input"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            ></input>
          </div>

          <div className="register-form-group full-width">
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
          </div>

          <div className="register-form-group half-width">
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

          <div className="register-form-group half-width">
            <label className="label">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              className="input"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            ></input>
          </div>

          <div className="register-form-group half-width">
            <label className="label">Phone number</label>
            <input
              type="text"
              placeholder="Phone number"
              className="input"
              value={contactNumber}
              onChange={(e) => {
                setContactNumber(e.target.value);
              }}
            ></input>
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
              placeholder="Zip code"
              className="input"
              value={zipCode}
              onChange={(e) => {
                setZipCode(e.target.value);
              }}
            ></input>
          </div>

          <Button
            className="btn register-button"
            onClick={handleRegistration}
            variant="primary"
            type="submit"
          >
            Register
          </Button>
        </div>
      )}
    </PublicLayout>
  );
};

export default RegisterPage;

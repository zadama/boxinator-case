import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

import Modal from "../../../components/modal/index";
import { parseISO } from "date-fns";

import "./../style.scss";
import "../../register/style.scss";

import { useAuth } from "../../../context/auth";
import { ADMIN, USER } from "../../../utils/roles";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilAlt} from "@fortawesome/free-solid-svg-icons";
import {Button} from "react-bootstrap";

const EditAccountModal = (props) => {
  const auth = useAuth();
  const { register, handleSubmit, errors, watch, reset, control } = useForm();

  const [showModal, setShowModal] = useState(false);
  const [dob, setDOB] = useState(
    props.account.dateOfBirth
      ? new Date(props.account.dateOfBirth)
      : new Date()
  );

  const [selectedCountry, setSelectedCountry] = useState({
    label: props.account.country,
    value: props.account.country,
  });

  const [selectedRole, setSelectedRole] = useState({
    label: props.account.role,
    value: props.account.role,
  });


  useEffect(() => {
    !props.account.dateOfBirth
      ? setDOB(new Date())
      : setDOB(parseISO(props.account.dateOfBirth)); // If user does not have a chosen DoB, set a temporary one
    reset({ ...props.account });
  }, [reset]);

  const onSubmit = (data) => {

    data.country = selectedCountry.value;

    data.role = selectedRole.value;
    if (props.account.firstName === data.firstName) {
      delete data.firstName;
    }

    if (props.account.lastName === data.lastName) {
      delete data.lastName;
    }

    if (props.account.email === data.email) {
      delete data.email;
    }

    if (props.account.zipcode === parseInt(data.zipcode)) {
      delete data.zipcode;
    }

    if (props.account.contactNumber === parseInt(data.contactNumber)) {
      delete data.contactNumber;
    }

    if (props.account.country === data.country) {
      delete data.country;
    }

    if (props.account.role === data.role) {
      delete data.role;
    }

    let formData = data;
    formData.id = props.account.id;

    if (parseISO(props.account.dateOfBirth) === formData.dateOfBirth) {
      delete formData.dateOfBirth;
    } else {
      formData.dateOfBirth = dob;
    }

    props.updateAccount(formData);
    onClose();

  };

  const countries = props.countries.map((country, id) => {
    return <option key={id}>{country}</option>
  })

  const onClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <Button onClick={ () => {
        setShowModal(true);
      }} className="btn btn-info btn-sm ml-2 mt-0"><FontAwesomeIcon icon={faPencilAlt}/>
      </Button>

      {showModal && (<Modal onClose={onClose}>

        <h3 style={{ paddingTop: "10px" }}>
          Editing {props.account.firstName} {props.account.lastName}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)}
              className="register">
          <div className="register-form-group half-width">
            <label className="label" htmlFor="firstName">
              Firstname:{" "}
            </label>
            <input
              className="input"
              name="firstName"
              defaultValue={props.account.firstName}
              ref={register({
                pattern: {
                  value: /^[A-Za-z]+$/,
                  message: "invalid format",
                },
              })}
            ></input>
          </div>
          <div className="register-form-group half-width">
            <label className="label" htmlFor="lastName">
              Lastname:{" "}
            </label>
            <input
              className="input"
              type="text"
              name="lastName"
              defaultValue={props.account.lastName}
              ref={register({
                pattern: {
                  value: /^[A-Za-z]+$/,
                  message: "invalid format",
                },
              })}
            ></input>
          </div>
          <div className="register-form-group half-width">
            <label className="label" htmlFor="email">
              Email:{" "}
            </label>
            <input
              className="input"
              type="text"
              name="email"
              defaultValue={props.account.email}
              ref={register({
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  name: "invalid format",
                },
              })}
            ></input>
          </div>
          <div className="register-form-group half-width">
            <label className="label" htmlFor="dateOfBirth">
              Date of birth:{" "}
            </label>
            <DatePicker
              id="dateOfBirth"
              showYearDropdown
              selected={dob}
              dateFormat="dd/MM/yyyy"
              maxDate={new Date()}
              onChange={(date) => setDOB(date)}
              placeholderText="DD/MM/YYYY"
              autoComplete="off"
              className="input"
            />
          </div>
          <div className="register-form-group half-width">
            <label className="label" htmlFor="zipCode">
              Zip code:{" "}
            </label>
            <input
              className="input"
              type="text"
              name="zipCode"
              defaultValue={props.account.zipCode}
              ref={register}
            ></input>
          </div>
          <div className="register-form-group half-width">
            <label className="label" htmlFor="country">
              Country:{" "}
            </label>
            {!props.countries ? (
              "loading..."
            ) : (
              <Select
                value={selectedCountry}
                className="select-picker"
                placeholder={"Select Country"}
                options={props.countries}
                onChange={(data) => setSelectedCountry(data)}
              />
            )}
          </div>
          <div
            className={`register-form-group ${
              auth.user.role === USER ? "full-width" : "half-width"
            }`}
          >
            <label className="label" htmlFor="contactNumber">
              Contact number:{" "}
            </label>
            <input
              className="input"
              type="text"
              name="contactNumber"
              defaultValue={props.account.contactNumber}
              ref={register}
            ></input>
          </div>
          {auth.user.role === ADMIN && (
            <div className="register-form-group half-width">
              <label className="label" htmlFor="role">
                Role:{" "}
              </label>
              <Select 
                value={selectedRole}
                className="select-picker"
                placeholder={"Select role"}
                options={[
                  {label: ADMIN, value: ADMIN},
                  {label: USER, value: USER}
                ]}
                onChange={(data) => setSelectedRole(data)}
              />
            </div>
          )}
          <div
            style={{ display: "flex" }}
            className="form-buttons register-form-group full-width"
          >
            <input
              style={{ flex: "1", marginRight: "10px" }}
              type="submit"
              className="btn btn-primary"
              value="Save"
            />
            <button
              style={{ flex: "1" }}
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>)}
    </>
  );
};

export default EditAccountModal;

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

import Modal from "../../../components/modal/index";
import { parseISO } from "date-fns";

import "./../style.scss";
import "../../register/style.scss";

import { useAuth } from "../../../context/auth";
import { ADMIN, USER } from "../../../utils/roles";
import { updateAccount } from "../../../api/user";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const EditAccountModal = (props) => {
  const auth = useAuth();
  const { register, handleSubmit, errors, watch, reset, control } = useForm();
  const [showModal, setShowModal] = useState(true);
  const [dob, setDOB] = useState(
    props.thisAccount.dateOfBirth
      ? new Date(props.thisAccount.dateOfBirth)
      : new Date()
  );

  const [selectedCountry, setSelectedCountry] = useState({
    label: props.thisAccount.country,
    value: props.thisAccount.country,
  });

  const [selectedRole, setSelectedRole] = useState({
    label: props.thisAccount.role,
    value: props.thisAccount.role,
  });

  useEffect(() => {
    !props.thisAccount.dateOfBirth
      ? setDOB(new Date())
      : setDOB(parseISO(props.thisAccount.dateOfBirth)); // If user does not have a chosen DoB, set a temporary one
    reset({ ...props.thisAccount });
  }, [reset]);

  const onSubmit = (data) => {
    console.log(selectedCountry);
    data.country = selectedCountry.value;

    data.role = selectedRole.value;
    if (props.thisAccount.firstName === data.firstName) {
      delete data.firstName;
    }

    if (props.thisAccount.lastName === data.lastName) {
      delete data.lastName;
    }

    if (props.thisAccount.email === data.email) {
      delete data.email;
    }

    if (props.thisAccount.zipCode === parseInt(data.zipCode)) {
      delete data.zipCode;
    }

    if (props.thisAccount.contactNumber === parseInt(data.contactNumber)) {
      delete data.contactNumber;
    }

    if (props.thisAccount.country === data.country.value) {
      delete data.country;
    }

    if (props.thisAccount.role === data.role) {
      delete data.role;
    }

    let formData = data;

    if (parseISO(props.thisAccount.dateOfBirth) === formData.dateOfBirth) {
      delete formData.dateOfBirth;
    } else {
      formData.dateOfBirth = dob;
    }

    handleSaveEditedUser(formData);
  };

  const handleSaveEditedUser = async (user) => {
    // Called when an admin saves changes to an account

    console.log(user);

    try {
      const token = await auth.getUserToken(); // Get sessiontoken

      await updateAccount(token, props.thisAccount.id, user); // Pass token, pathvariable and body with request
      props.reRender(); // Rerender page
      props.toggleToast("saved");
    } catch (error) {
      console.log(error);
    } finally {
      // popup closed
      setShowModal(!showModal);
      props.onClose();
    }
  };

  const onClose = () => {
    setShowModal(!showModal);
    props.onClose();
  };

  return (
    <>
      <Modal isVisible={showModal} onClose={onClose}>
        <h3 style={{ paddingTop: "10px" }}>
          Editing {props.thisAccount.firstName} {props.thisAccount.lastName}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="register">
          <div className="register-form-group half-width">
            <label className="label" htmlFor="firstName">
              Firstname:{" "}
            </label>
            <input
              className="input"
              name="firstName"
              defaultValue={props.thisAccount.firstName}
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
              defaultValue={props.thisAccount.lastName}
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
              defaultValue={props.thisAccount.email}
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
              defaultValue={props.thisAccount.zipCode}
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
                placeholder={"Select country"}
                options={props.countries}
                isSearchable={false}
                onChange={(data) => {
                  setSelectedCountry(data);
                }}
              />
            )}
          </div>
          <div
            className={`register-form-group ${
              props.thisAccount.role === USER ? "full-width" : "half-width"
            }`}
          >
            <label className="label" htmlFor="contactNumber">
              Contact number:{" "}
            </label>
            <input
              className="input"
              type="text"
              name="contactNumber"
              defaultValue={props.thisAccount.contactNumber}
              ref={register}
            ></input>
          </div>
          {props.thisAccount.role === ADMIN && (
            <div className="register-form-group half-width">
              <label className="label" htmlFor="role">
                Role:{" "}
              </label>
              <Select
                value={selectedRole}
                className="select-picker"
                placeholder={"Select role"}
                options={[
                  { label: ADMIN, value: ADMIN },
                  { label: USER, value: USER },
                ]}
                isSearchable={false}
                onChange={(data) => {
                  setSelectedRole(data);
                }}
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
      </Modal>
    </>
  );
};

export default EditAccountModal;

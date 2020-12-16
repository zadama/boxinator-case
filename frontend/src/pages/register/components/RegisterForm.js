import React, { useState } from "react";

import { useForm, Controller } from "react-hook-form";
import Select, { components } from "react-select";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "../style.scss";

import Button from "react-bootstrap/Button";
import Alert from "../../../components/alert";

const { Option } = components;
const IconOption = (props) => {
  return (
    <Option {...props}>
      <img
        src={require("../../../assets/" + props.data.label + ".svg").default}
        alt={props.data.label}
        style={{ maxWidth: "40px", marginRight: "10px" }}
      ></img>{" "}
      {props.data.label}
    </Option>
  );
};

const RegisterForm = ({
  handleRegistration,
  countries,
  errorMessage,
  closeAlert,
}) => {
  const {
    register: registerForm,
    handleSubmit,
    watch,
    errors,
    control,
  } = useForm();

  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const { country } = watch(["country"]);

  const onSubmit = (data) => {
    // We omit confirmPassword. Not needed when sending the data to database.
    const { confirmPassword, ...rest } = data;

    let formData = rest;

    formData.country = country.value;
    formData.dateOfBirth = dateOfBirth;

    handleRegistration(formData);
  };

  return (
    <form className="register" onSubmit={handleSubmit(onSubmit)}>
      {errorMessage && (
        <Alert message={errorMessage} onClose={closeAlert} variant={"danger"} />
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
            pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
          })}
          style={{ borderColor: errors.password && "red" }}
        ></input>
        {errors.password && (
          <>
            {errors.password.type === "required" && (
              <span className="error-span">Invalid Password</span>
            )}
            {errors.password.type === "minLength" && (
              <span className="error-span">
                Password must be at least 6 characters.
              </span>
            )}
            {errors.password.type === "pattern" && (
              <span className="error-span">
                Password must include at least one character and number.
              </span>
            )}
          </>
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
            {errors.confirmPassword.message
              ? errors.confirmPassword.message
              : "Please confirm your password."}
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

        <Controller
          as={
            <Select
              className="select-picker"
              placeholder={"Select country"}
              options={countries}
              components={{ Option: IconOption }}
            />
          }
          name="country"
          control={control}
          valueName="selected"
          rules={{
            validate: (data) => {
              return data != null;
            },
          }}
        />
        {errors.country && (
          <span className="error-span">You have to select a country</span>
        )}
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

        {errors.zipCode && (
          <span className="error-span">
            {errors.zipCode.message
              ? errors.zipCode.message
              : "Zipcode is required."}
          </span>
        )}
      </div>

      <Button className="btn register-button" variant="primary" type="submit">
        Register
      </Button>
    </form>
  );
};

export default RegisterForm;

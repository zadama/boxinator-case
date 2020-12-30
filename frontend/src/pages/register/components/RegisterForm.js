import React, { useState } from "react";

import { useForm, Controller } from "react-hook-form";
import Select, { components } from "react-select";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "../style.scss";

import Button from "react-bootstrap/Button";
import Alert from "../../../components/alert";

import CountryCodes from "../../../components/country-codes";

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
  guestEmail,
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

  const [countryCode, setCountryCode] = useState({
    label: "Sweden +46",
    value: "+46",
  });

  const onSubmit = (data) => {
    // We omit confirmPassword. Not needed when sending the data to database.
    const { confirmPassword, ...rest } = data;

    let formData = rest;

    formData.country = country.value;
    formData.dateOfBirth = dateOfBirth;
    console.log(formData);

    formData.contactNumber = countryCode.value + formData.contactNumber;
    console.log(formData);
    //handleRegistration(formData);
  };

  return (
    <form className="register" onSubmit={handleSubmit(onSubmit)}>
      {errorMessage && (
        <Alert
          message={errorMessage}
          onClose={closeAlert}
          expire={3000}
          variant={"danger"}
        />
      )}

      <div className="register-form-group half-width">
        <label className="label">Firstname</label>
        <input
          type="text"
          name="firstName"
          placeholder="First name"
          className="input"
          ref={registerForm({
            required: true,
            minLength: 2,
            maxLength: 35,

            pattern: /^[ÆØÅæøåa-zA-Z\s]*$/,
          })}
          style={{ borderColor: errors.firstName && "red" }}
        ></input>

        {errors.firstName?.type === "required" && (
          <span className="error-span">First name is required.</span>
        )}
        {errors.firstName?.type === "minLength" && (
          <span className="error-span">
            First name should contain at least 2 letters.
          </span>
        )}
        {errors.firstName?.type === "maxLength" && (
          <span className="error-span">First name can't exceed 35 letters</span>
        )}
        {errors.firstName?.type === "pattern" && (
          <span className="invalid">Only letters are allowed.</span>
        )}
      </div>
      <div className="register-form-group half-width">
        <label className="label">Last name</label>
        <input
          type="text"
          name="lastName"
          placeholder="Last name"
          className="input"
          ref={registerForm({
            required: true,
            minLength: 2,
            maxLength: 35,
            pattern: /^[ÆØÅæøåa-zA-Z\s]*$/,
          })}
          style={{ borderColor: errors.lastName && "red" }}
        ></input>
        {errors.lastName?.type === "required" && (
          <span className="error-span">Last name is required.</span>
        )}
        {errors.lastName?.type === "minLength" && (
          <span className="error-span">
            Last name should contain at least 2 letters.
          </span>
        )}
        {errors.lastName?.type === "maxLength" && (
          <span className="error-span">Last name can't exceed 35 letters</span>
        )}
        {errors.lastName?.type === "pattern" && (
          <span className="invalid">Only letters are allowed.</span>
        )}
      </div>

      <div className="register-form-group full-width">
        <label className="label">Email</label>

        {guestEmail ? (
          <input
            value={guestEmail}
            type="email"
            name="email"
            placeholder="Email"
            className="input"
            readOnly
          />
        ) : (
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input"
            ref={registerForm({
              required: "Enter your e-mail",
              pattern: {
                pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "Enter a valid e-mail address",
              },
            })}
            style={{ borderColor: errors.email && "red" }}
          ></input>
        )}

        {errors.email?.type === "required" && (
          <span className="invalid">Email is required.</span>
        )}

        {errors.email?.type === "pattern" && (
          <span className="invalid">Invalid email format.</span>
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
            minLength: 8,
            pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
          })}
          style={{ borderColor: errors.password && "red" }}
        ></input>

        {errors.password?.type === "required" && (
          <span className="error-span">Please enter your password.</span>
        )}
        {errors.password?.type === "minLength" && (
          <span className="error-span">
            Password must be at least 8 characters.
          </span>
        )}
        {errors.password?.type === "pattern" && (
          <span className="error-span">
            Password must include at least one special character and a number.
          </span>
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
            minLength: 8,
            validate: (value) =>
              value === watch("password") || "Passwords don't match.",
          })}
          style={{ borderColor: errors.confirmPassword && "red" }}
        ></input>

        {errors.confirmPassword?.type === "required" && (
          <span className="error-span">You need to confirm your password.</span>
        )}

        {errors.confirmPassword?.type === "minLength" && (
          <span className="error-span">Password is at least 8 characters.</span>
        )}

        {errors.confirmPassword?.type === "validate" && (
          <span className="error-span">{errors.confirmPassword.message}</span>
        )}
      </div>

      <div className="register-form-group full-width">
        <label className="label">Phone number</label>

        <div className="phoneNbrContainer">
          <CountryCodes
            value={countryCode}
            handleChange={(data) => {
              setCountryCode(data);
            }}
          />

          <input
            type="text"
            name="contactNumber"
            placeholder="Phone number"
            className="input"
            ref={registerForm({
              required: true,
              minLength: 7,
              maxLength: 15,
              pattern: /^(\d)*$/,
              validate: (value) => !value.startsWith(0),
            })}
            style={{ borderColor: errors.contactNumber && "red" }}
          ></input>
        </div>

        {errors.contactNumber?.type === "required" && (
          <span className="error-span">Phone number is required.</span>
        )}
        {errors.contactNumber?.type === "minLength" && (
          <span className="error-span">
            Phone number must be at least 7 digits.
          </span>
        )}
        {errors.contactNumber?.type === "maxLength" && (
          <span className="error-span">
            Phone number can't exceed 15 digits.
          </span>
        )}
        {errors.contactNumber?.type === "pattern" && (
          <span className="error-span">
            Phone number can only contain digits.
          </span>
        )}

        {errors.contactNumber?.type === "validate" && (
          <span className="error-span">
            Phone number can't start with 0. Select your country's phone code
            and enter your number excluding 0.
          </span>
        )}
      </div>

      <div className="register-form-group full-width">
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
              isSearchable={false}
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
            pattern: /^(\d)*$/,
            minLength: 4,
            maxLength: 16,
          })}
        ></input>

        {errors.zipCode?.type === "required" && (
          <span className="error-span">Zip code is required.</span>
        )}

        {errors.zipCode?.type === "pattern" && (
          <span className="error-span">Zip code can only contain digits.</span>
        )}
        {errors.zipCode?.type === "minLength" && (
          <span className="error-span">Zip code can only contain digits.</span>
        )}

        {errors.zipCode?.type === "maxLength" && (
          <span className="error-span">Zip code can't exceed 16 digits.</span>
        )}
      </div>

      <Button className="btn register-button" variant="primary" type="submit">
        Register
      </Button>
    </form>
  );
};

export default RegisterForm;

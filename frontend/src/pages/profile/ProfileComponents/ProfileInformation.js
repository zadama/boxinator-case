import React, { useState, useEffect } from "react";
import "../../register/style.scss";
import { Button } from "react-bootstrap";
import Toast from "react-bootstrap/Toast";

import { useAuth } from "../../../context/auth";
import { getAccount } from "../../../api/user";
import { getAllCountries } from "../../../api/countries";
import EditAccountModal from "../../admin/AccountPageModals/EditAccountModal";

const ProfileInformation = (props) => {
  const auth = useAuth();
  const [data, setData] = useState(null);
  const [countries, setCountries] = useState([]);
  const [editAccountView, setEditAccountView] = useState(false);
  const [thisAccount, setThisAccount] = useState(null);

  const [toast, setToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const renderProfileInformationWithToken = async () => {
    try {
      const token = await auth.getUserToken();

      const { data: thisAccount } = await getAccount(token, auth.user.email);
      let { data: savedCountries } = await getAllCountries();

      savedCountries = savedCountries.data.map((country) => {
        return {
          label: country.name,
          value: country.name,
        };
      });

      setCountries(savedCountries);
      setData(thisAccount.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    renderProfileInformationWithToken();
  }, []);

  const handleEditClick = (account) => {
    // Open modal when admin wants to edit an account
    setEditAccountView(!editAccountView);
    setThisAccount(account);
  };

  const toggleToast = (action) => {
    setToastMsg(action);
    setToast(true);
  };

  return (
    <>
      <Toast
        show={toast}
        onClose={() => {
          setToast(false);
          setToastMsg("");
        }}
        delay={2500}
        autohide
      >
        <Toast.Header>
          <strong className="mr-auto">Bootstrap</strong>
          <small>just now</small>
        </Toast.Header>
        <Toast.Body>Account {toastMsg && toastMsg}.</Toast.Body>
      </Toast>
      {!data ? (
        <h3>loading...</h3>
      ) : (
        <>
          <div className="register">
            <div className="register-form-group half-width">
              <label htmlFor="id" className="label">
                Account ID{" "}
              </label>
              <input className="input" readOnly value={data.id} />
            </div>
            <div className="register-form-group half-width">
              <label htmlFor="email" className="label">
                Email{" "}
              </label>
              <input className="input" readOnly value={data.email} />
            </div>
            <div className="register-form-group half-width">
              <label className="label" htmlFor="firstName">
                Firstname{" "}
              </label>
              <input className="input" readOnly value={data.firstName} />
            </div>
            <div className="register-form-group half-width">
              <label className="label" htmlFor="lastName">
                Lastname{" "}
              </label>
              <input className="input" readOnly value={data.lastName} />
            </div>
            <div className="register-form-group half-width">
              <label className="label" htmlFor="dateOfBirth">
                Date of birth{" "}
              </label>
              <input className="input" readOnly value={data.dateOfBirth} />
            </div>
            <div className="register-form-group half-width">
              <label className="label" htmlFor="country">
                Country{" "}
              </label>
              <input className="input" readOnly value={data.country} />
            </div>
            <div className="register-form-group half-width">
              <label className="label" htmlFor="contactNumber">
                Contact number{" "}
              </label>
              <input className="input" readOnly value={data.contactNumber} />
            </div>
            <div className="register-form-group half-width">
              <label className="label" htmlFor="zipCode">
                Zip code{" "}
              </label>
              <input className="input" readOnly value={data.zipCode} />
            </div>
          </div>
          <div className="profile-buttons">
            <Button onClick={() => handleEditClick(data)}>edit</Button>
            <Button
              onClick={async () => {
                await auth.logout();
              }}
            >
              logout
            </Button>
          </div>
        </>
      )}
      {editAccountView && (
        <EditAccountModal
          onClose={() => setEditAccountView(!editAccountView)}
          countries={countries}
          thisAccount={thisAccount}
          toggleToast={toggleToast}
          reRender={renderProfileInformationWithToken}
        />
      )}
    </>
  );
};

export default ProfileInformation;

import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import Toast from "react-bootstrap/Toast";

import "./style.scss";

import { useAuth } from "../../context/auth";
import { getAllCountries } from "../../api/countries";
import { getAllAccounts } from "../../api/user";
import DeleteAccountModal from "./AccountPageModals/DeleteAccountModal";
import EditAccountModal from "./AccountPageModals/EditAccountModal";

const AccountPage = () => {
  const auth = useAuth();
  const [data, setData] = useState(null);
  const [countries, setCountries] = useState([]);
  const [editAccountView, setEditAccountView] = useState(false);
  const [deleteAccountView, setDeleteAccountView] = useState(false);
  const [thisAccount, setThisAccount] = useState(null);
  const [toast, setToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const renderUserDataWithAdminToken = async () => {
    try {
      const token = await auth.getUserToken();

      const { data } = await getAllAccounts(token);

      let { data: savedCountries } = await getAllCountries();

      savedCountries = savedCountries.data.map((country) => {
        return [country.name];
      });

      setCountries(savedCountries);
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleToast = (action) => {
    setToastMsg(action);
    setToast(true);
  };

  useEffect(() => {
    renderUserDataWithAdminToken();
  }, []);

  const handleEditClick = (user) => {
    // Open modal when admin wants to edit an account
    setEditAccountView(!editAccountView);
    setThisAccount(user);
  };

  const handleDeleteClick = (user) => {
    // Open modal when admin wants to delete an account
    setDeleteAccountView(!deleteAccountView);
    setThisAccount(user);
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
        <div>loading...</div>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Date of Birth</th>
              <th>Zipcode</th>
              <th>Country of residence</th>
              <th>Contact number</th>
              <th>Role</th>
              <th>Shipments</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map(function (user) {
              return (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    {user.firstName} {user.lastName}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    {!user.dateOfBirth ? "Not defined" : user.dateOfBirth}
                  </td>
                  <td>{!user.zipCode ? "Not defined" : user.zipCode}</td>
                  <td>{!user.country ? "Not defined" : user.country}</td>
                  <td>
                    {!user.contactNumber ? "Not defined" : user.contactNumber}
                  </td>
                  <td>{user.role}</td>
                  <td className="shipments">{user.userShipments.length}</td>
                  <td className="btns">
                    <button
                      className="btns btn btn-success"
                      onClick={() => handleEditClick(user)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-pencil"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"
                        />
                      </svg>
                    </button>
                    <button
                      className="btns btn btn-danger"
                      onClick={() => handleDeleteClick(user)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-trash"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                        <path
                          fillRule="evenodd"
                          d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
      <section>
        {editAccountView && (
          <EditAccountModal
            onClose={() => setEditAccountView(!editAccountView)}
            countries={countries}
            thisAccount={thisAccount}
            reRender={renderUserDataWithAdminToken}
            toggleToast={toggleToast}
          />
        )}
        {deleteAccountView && (
          <DeleteAccountModal
            onClose={() => setDeleteAccountView(!deleteAccountView)}
            thisAccount={thisAccount}
            reRender={renderUserDataWithAdminToken}
            toggleToast={toggleToast}
          />
        )}
      </section>
    </>
  );
};

export default AccountPage;

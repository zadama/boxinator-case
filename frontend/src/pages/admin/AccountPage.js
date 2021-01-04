import React, { useState, useEffect, useRef } from "react";
import Search from "../../components/search/Search";
import { Table } from "react-bootstrap";
import Toast from "react-bootstrap/Toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

import "./style.scss";

import { useAuth } from "../../context/auth";
import { getAllCountries } from "../../api/countries";
import { getAllAccounts } from "../../api/user";
import DeleteAccountModal from "./AccountPageModals/DeleteAccountModal";
import EditAccountModal from "./AccountPageModals/EditAccountModal";

const AccountPage = () => {

  //For search component
  const firstUpdate = useRef(true);
  const [searchValue, setSearchValue] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [accountList, setAccountList] = useState([]);
  //
  
  const auth = useAuth();
  const [data, setData] = useState(null);
  const [countries, setCountries] = useState([]);
  const [editAccountView, setEditAccountView] = useState(false);
  const [deleteAccountView, setDeleteAccountView] = useState(false);
  const [thisAccount, setThisAccount] = useState(null);
  const [toast, setToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");


  useEffect(() => { if (firstUpdate.current) {
    firstUpdate.current = false;
    renderUserDataWithAdminToken();
    return;
  } else {
    const filtered = accounts.filter((account) => {
      return (
        account.id + "" === searchValue ||
        account.email.toLowerCase().includes(searchValue.toLowerCase()) ||
        account.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        account.role.toUpperCase().includes(searchValue.toUpperCase()) ||
        account.country.toLower().includes(searchValue.toLowerCase()) 
      );
    });
    setAccountList(filtered);
  }
}, [searchValue]);

  const renderUserDataWithAdminToken = async () => {
    try {
      const token = await auth.getUserToken();

      let response = await getAllAccounts(token);

      let { data: savedCountries } = await getAllCountries();

      savedCountries = savedCountries.data.map((country) => {
        return [country.name];
      });

      let { data: savedAccounts } = response.data;

      savedAccounts = savedAccounts
        .sort(function (a, b) {
          return a.id - b.id;
        })
        .map((account) => {
          return {
            id: account.id,
            name: account.firstName + " " + account.lastName,
            email: account.email,
            dateOfBirth: account.dateOfBirth,
            zipcode: account.zipcode,
            country: account.country,
            contactNumber: account.contactNumber,
            role: account.role,
          };
        });
      console.log(savedAccounts);
      setAccounts(savedAccounts);
      setAccountList(savedAccounts);
      setCountries(savedCountries); //from prev. version
    } catch (error) {
      console.log(error);
    }
  };

    
  const toggleToast = (action) => {
    setToastMsg(action);
    setToast(true);
  };

 

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
      
      <Search 
        setSearchValue={setSearchValue}
        accountList={accountList}/>
      {!data ? (
        <div>loading...</div>
      ) : ( 
        
        <Table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Date of Birth</th>
              <th scope="col">Zipcode</th>
              <th scope="col">Country of residence</th>
              <th scope="col">Contact number</th>
              <th scope="col">Role</th>
              <th scope="col">Shipments</th>
              <th scope="col">Edit</th>
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
                    {!user.dateOfBirth ? "Not defined" : new Date(user.dateOfBirth)
                      .toISOString()
                      .slice(0, 10)
                      .replace("T", " ")}
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
                      className="btn btn-info btn-sm ml-2 mt-0"
                      onClick={() => handleEditClick(user)}
                    >
                     <FontAwesomeIcon icon={faPencilAlt}/>
                    </button>
                    <button
                      className="btn-danger btn-sm ml-2"
                      onClick={() => handleDeleteClick(user)}
                    >
                    <FontAwesomeIcon icon={faTrashAlt} />
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

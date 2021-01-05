import React, { useState, useEffect, useRef } from "react";
import Search from "../../components/search/Search";
import Toast from "react-bootstrap/Toast";

import "./style.scss";

import { useAuth } from "../../context/auth";
import { getAllCountries } from "../../api/countries";
import {deleteAccount, getAllAccounts, updateAccount} from "../../api/user";
import AccountList from "./AccountPageModals/AccountList";

const AccountPage = () => {

  //For search component
  const firstUpdate = useRef(true);
  const [searchValue, setSearchValue] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [accountList, setAccountList] = useState([]);
  //

  const auth = useAuth();
  const [countries, setCountries] = useState([]);
  const [toast, setToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    if (firstUpdate.current) {
    firstUpdate.current = false;
    renderUserDataWithAdminToken();
    return;
  } else {
    const filtered = accounts.filter((account) => {
      return (
        account.id + "" === searchValue ||
        account.email.toLowerCase().includes(searchValue.toLowerCase()) ||
        account.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
        account.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
        account.role.toUpperCase().includes(searchValue.toUpperCase()) ||
        account.country.toLowerCase().includes(searchValue.toLowerCase())
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
        return {
          label: country.name,
          value: country.name,
        };
      });
      let { data: savedAccounts } = response.data;
      console.log(response.data);
      savedAccounts = savedAccounts
        .sort(function (a, b) {
          return a.id - b.id;
        })
        .map((account) => {
          return {
            id: account.id,
            firstName: account.firstName,
            lastName:  account.lastName,
            email: account.email,
            dateOfBirth: account.dateOfBirth,
            zipcode: account.zipCode,
            country: account.country,
            contactNumber: account.contactNumber,
            role: account.role,
            shipments: account.userShipments
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

  const handleSaveEditedUser = async (account) => {
    // Called when an admin saves changes to an account
    console.log(account);
    try {
      const token = await auth.getUserToken(); // Get sessiontoken
      await updateAccount(token, account.id, account); // Pass token, pathvariable and body with request
      renderUserDataWithAdminToken();//rerender page
      toggleToast("saved");
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const deleteUser = async (accountId) => {
    try {
      const token = await auth.getUserToken(); // Get sessiontoken
      await deleteAccount(token, accountId); // Pass token and pathvariable
      toggleToast("deleted");
      renderUserDataWithAdminToken();
    } catch (error) {
      console.log(error);
    } finally {
      await renderUserDataWithAdminToken();
    }
  }

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
      <div>
        <Search
            setSearchValue={setSearchValue}
            accountList={accountList}/>
      </div>

      <div className="all-accounts-container">
        <div className="row account-table-header">
          <h4>All Accounts</h4>
        </div>

        {!accountList ? (
            <div>loading...</div>
        ) : (
            <AccountList accountList={accountList}
                         countries={countries}
                         updateAccount={handleSaveEditedUser}
                         deleteAccount={deleteUser}/>

        )}
      </div>
    </>
  );
};

export default AccountPage;

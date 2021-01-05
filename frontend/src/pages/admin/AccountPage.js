import React, { useState, useEffect, useRef } from "react";
import Search from "../../components/search/Search";
import Toaster from "../../components/toast/Toaster"

import "./style.scss";

import { useAuth } from "../../context/auth";
import { getAllCountries } from "../../api/countries";
import {deleteAccount, getAllAccounts, updateAccount} from "../../api/user";
import AccountList from "./AccountPageModals/AccountList";

const AccountPage = () => {

  //For Search component
  const firstUpdate = useRef(true);
  const [searchValue, setSearchValue] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [accountList, setAccountList] = useState([]);

  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState([]);

  //For Toaster component
  const [toastHeader, setToastHeader] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [toast, setToast] = useState(false);

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
    setIsLoading(true);
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
            zipCode: account.zipCode,
            country: account.country,
            contactNumber: account.contactNumber,
            role: account.role,
            shipments: account.userShipments
          };
        });

      setAccounts(savedAccounts);
      setAccountList(savedAccounts);
      setCountries(savedCountries); //from prev. version
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Called when an admin saves changes to an account
  const handleSaveEditedUser = async (account) => {
    setIsLoading(true);
    try {
      const token = await auth.getUserToken(); // Get sessiontoken
      await updateAccount(token, account.id, account); // Pass token, pathvariable and body with request
      renderUserDataWithAdminToken();//rerender page
      setToastHeader("Success");
      setToastMsg("Account record was updated successfully.");
      setToast(true);
    } catch (error) {
      console.log(error);
      setToastHeader("Error");
      setToastMsg("Unable to update account record details.");
      setToast(true);
    } finally {
      setIsLoading(false);
      await renderUserDataWithAdminToken();
    }
  };

  const deleteUser = async (accountId) => {
    setIsLoading(true);
    try {
      const token = await auth.getUserToken(); // Get sessiontoken
      await deleteAccount(token, accountId); // Pass token and pathvariable
      setToastHeader("Success");
      setToastMsg("Account record was deleted successfully.");
      setToast(true);
      renderUserDataWithAdminToken();
    } catch (error) {
      console.log(error);
      setToastHeader("Error");
      setToastMsg("Unable to delete shipment record details.");
      setToast(true);
    } finally {
      setIsLoading(false);
      await renderUserDataWithAdminToken();
    }
  }

  return (
    <>
      {toast && (
          <Toaster
              toastHeaderMsg={toastHeader}
              toastMsg={toastMsg}
              onClose={() => {
                setToast(false);
              }}
          />
      )}
      <div>
        <Search setSearchValue={setSearchValue}/>
      </div>

      <div className="all-accounts-container">
        <div className="row account-table-header">
          <h4>All Accounts</h4>
        </div>

        <AccountList
            isLoading={isLoading}
            accountList={accountList}
            countries={countries}
            updateAccount={handleSaveEditedUser}
            deleteAccount={deleteUser}/>
      </div>
    </>
  );
};

export default AccountPage;

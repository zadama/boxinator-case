import React from "react";
import "./style.scss";
import { useAuth } from "../../context/auth";
import PrivateLayout from "../../layouts/PrivateLayout";
import AdminMenu from "./AdminMenu";
import { useEffect } from "react";
import { useState } from "react";
import { checkToken } from "../../api/user";

import AccountPage from "./AccountPage";
import CountryPage from "../country/CountryPage";
import HandleShipmentsPage from "./HandleShipmentsPage";

/**
 * hämta alla shipments från backend, skicka med firebase token
 * annars ska det ej funka, testa i postman också sen..
 *
 * Skapa switch route + komponenter /admin-dashboard/countries etc, med valen i sidebar
 * som ska navigera dit..
 */

const AdminPage = () => {
  const auth = useAuth();
  const [data, setData] = useState(null);
  const [title, setTitle] = useState("");
  const [showAccounts, setShowAccounts] = useState(false);
  const [showCountries, setShowCountries] = useState(false);
  const [showShipments, setShowShipments] = useState(false);

  const renderExampleDataWithToken = async () => {
    try {
      const token = await auth.getUserToken();

      const { data } = await checkToken(token);

      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("CALLED...");
    renderExampleDataWithToken();
  }, []);

  const handleUserDetailsClick = (event, value) => {
    if(value === "accounts") {
      setTitle("Accounts");
      setShowCountries(false);
      setShowShipments(false);
      setShowAccounts(!showAccounts);
    } else if(value === "countries") {
      setTitle("Countries")
      setShowShipments(false);
      setShowAccounts(false);
      setShowCountries(!showCountries);
    } else if(value === "shipments") {
      setTitle("Shipments")
      setShowCountries(false);
      setShowAccounts(false);
      setShowShipments(!showShipments);
    }
  }

  return (
    <PrivateLayout>
      <div className="admin-page">
        <section className="admin-title">
          {!data ? (
            <div>loading....</div>
          ) : (
            <div>
              {!title ? <h3>Welcome back, "{data}"</h3> : <h3>{title}</h3>}
            </div>
          )}
        </section>
        <section className="admin-menu">
          <AdminMenu getDetails={(event, value) => handleUserDetailsClick(event, value)}/>
        </section>
        <section>
          {!showAccounts ?  "" : <AccountPage />}
          {!showCountries ? "" : <CountryPage />}
          {!showShipments ? "" : <HandleShipmentsPage />}
        </section>
      </div>
    </PrivateLayout>
  );
};

export default AdminPage;

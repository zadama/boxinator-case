import React from "react";
import "./style.scss";
import { useAuth } from "../../context/auth";
import PrivateLayout from "../../layouts/PrivateLayout";
import AdminMenu from "./AdminMenu";
import { useEffect } from "react";
import { useState } from "react";
import { getAccount } from "../../api/user";

import AccountPage from "./AccountPage";
import CountryPage from "../country/CountryPage";
import HandleShipmentsPage from "./manageShipments/HandleShipmentsPage";
import Alert from "../../components/alert";

/**
 * hämta alla shipments från backend, skicka med firebase token
 * annars ska det ej funka, testa i postman också sen..
 *
 * Skapa switch route + komponenter /admin-dashboard/countries etc, med valen i sidebar
 * som ska navigera dit..
 */

const AdminPage = ({ location }) => {
  const auth = useAuth();
  const [data, setData] = useState(null);
  const [title, setTitle] = useState("");
  const [showAccounts, setShowAccounts] = useState(false);
  const [showCountries, setShowCountries] = useState(false);
  const [showShipments, setShowShipments] = useState(false);
  const [searchterms, setSearchterms] = useState(null);

  const [alert, setAlert] = useState(null);

  const renderExampleDataWithToken = async () => {
    try {
      const token = await auth.getUserToken();

      const { data } = await getAccount(token, auth.user.email);
      setData(data.data.firstName + " " + data.data.lastName);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (location && location.state && location.state.claimShipment) {
      setAlert({
        message:
          "Shipment with id " +
          location.state.claimShipment +
          " was successfully added!",
        variant: "success",
      });
    }

    renderExampleDataWithToken();
  }, []);

  const handleMenuClick = (event, value) => {
    if (value === "accounts") {
      setTitle("Accounts");
      setSearchterms(["id, ", "name, ", "email, ", "country, ", "role"]);
      setShowCountries(false);
      setShowShipments(false);
      setShowAccounts(!showAccounts);
    } else if (value === "countries") {
      setTitle("Shipping Countries");
      setSearchterms(["id, ", "name, ", "country code"]);
      setShowShipments(false);
      setShowAccounts(false);
      setShowCountries(!showCountries);
    } else if (value === "shipments") {
      setTitle("Shipments");
      setSearchterms(["id, ", "shipment status"]);
      setShowCountries(false);
      setShowAccounts(false);
      setShowShipments(!showShipments);
    }
  };

  return (
    <PrivateLayout>
      {alert && (
        <Alert
          message={alert.message}
          onClose={() => {
            setAlert(null);
          }}
          variant={alert.variant}
          expire={3000}
        />
      )}

      <div className="admin-page">
        <section className="admin-title">
          {!data ? (
            <div>loading....</div>
          ) : (
            <div>{!title ? <h3>Welcome "{data}"</h3> : <h3>{title}</h3>}</div>
          )}
        </section>
        <section className="admin-menu">
          <AdminMenu
            getDetails={(event, value) => handleMenuClick(event, value)}
          />
        </section>
        <section style={{ borderTop: "1px solid #dee2e6" }}>
          {!showAccounts ? "" : <AccountPage searchterms={searchterms}/>}
          {!showCountries ? "" : <CountryPage searchterms={searchterms}/>}
          {!showShipments ? "" : <HandleShipmentsPage searchterms={searchterms}/>}
        </section>
      </div>
    </PrivateLayout>
  );
};

export default AdminPage;

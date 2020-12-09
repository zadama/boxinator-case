import React from "react";
import "./style.scss";
import { useAuth } from "../../context/auth";
import PrivateLayout from "../../layouts/PrivateLayout";
import Sidebar from "./Sidebar";
import { useEffect } from "react";
import { useState } from "react";
import { getAllCountries } from "../../api/countries";
import { checkToken } from "../../api/user";
import UserDetails from "./UserDetails";

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
  const [showUsers, setShowUsers] = useState(false);

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

  const handleUserDetailsClick = (event) => {
    setShowUsers(!showUsers);
  }

  return (
    <PrivateLayout>
      <div className="admin-page">
        <section className="sidebar">
          <Sidebar getDetails={event => handleUserDetailsClick(event)}/>
        </section>

        <section className="admin-content">
          {!data ? (
            <div>loading....</div>
          ) : (
            <div>
              Logged in user's email(verified from server via token): {data}
            </div>
          )}
        </section>
        <section>
          {!showUsers ?  "" : <UserDetails />}
        </section>
      </div>
    </PrivateLayout>
  );
};

export default AdminPage;

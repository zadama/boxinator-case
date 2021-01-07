import React from "react";
import "./style.scss";
import Logo from "../../assets/logo_one.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";
import { ADMIN, USER, GUEST } from "../../utils/roles";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../context/auth";

const Navbar = () => {
  const location = useLocation();
  const auth = useAuth();

  useEffect(() => {}, [auth.user, location]);

  return (
    <nav className="nav">
      <Link to="/">
        <div className="logo-container">
          <img
            alt="boxinator logo"
            src={Logo}
            style={{ maxWidth: "100px" }}
          ></img>
          <h3>SendIt</h3>
        </div>
      </Link>
      <div style={{ marginRight: "auto" }}></div>

      <div style={{ display: "flex", alignItems: "center" }}>
        {auth.user && (auth.user.role === ADMIN || auth.user.role === USER) ? (
          <>
            <Link to="/add-shipment">Add Shipment</Link>

            {auth.user.role === ADMIN && (
              <Link to="/admin-dashboard">Admin Dashboard</Link>
            )}

            {auth.user.role === USER && (
              <Link to="/handle-shipments">Shipments overview</Link>
            )}
            <Link to="/profile-dashboard">
              <FontAwesomeIcon size="lg" color={"black"} icon={faUserAlt} />
            </Link>
          </>
        ) : (
          (!auth.user || (auth.user && auth.user.role !== GUEST)) && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;

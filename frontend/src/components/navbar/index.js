import React from "react";
import "./style.scss";
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
      {auth.user && (auth.user.role === ADMIN || auth.user.role === USER) ? (
        <>
          <Link to="/add-shipment">Add Shipment</Link>
          {auth.user.role === ADMIN && (
            <Link to="/admin-dashboard">Admin Dashboard</Link>
          )}
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;

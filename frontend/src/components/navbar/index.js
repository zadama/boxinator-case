import React from "react";
import "./style.scss";
import { Link } from "react-router-dom";
import menu from "./menu";

const Navbar = () => {
  return (
    <nav className="nav">
      {menu.map((item, index) => (
        <Link key={index} to={item.path}>
          {item.name}
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;

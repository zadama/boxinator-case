import React from "react";
import Navbar from "../components/navbar";

const PrivateLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default PrivateLayout;

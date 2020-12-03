import React from "react";
import Navbar from "../components/navbar";

const PrivateLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main className="container">{children}</main>
    </div>
  );
};

export default PrivateLayout;

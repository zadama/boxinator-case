import React from "react";
import Navbar from "../components/navbar";

const PublicLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main className="container">{children}</main>
    </div>
  );
};

export default PublicLayout;

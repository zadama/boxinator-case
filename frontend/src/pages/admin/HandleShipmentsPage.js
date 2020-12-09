import React from "react";
import "./style.scss";
import { useAuth } from "../../context/auth";
import PrivateLayout from "../../layouts/PrivateLayout";
import Sidebar from "./Sidebar";
import { useEffect } from "react";
import { useState } from "react";
import { checkToken } from "../../api/user";

const HandleShipmentsPage = () => {
    return (
      <>
       <h1>Hola</h1>
      </>
    );
  };
  
export default HandleShipmentsPage;

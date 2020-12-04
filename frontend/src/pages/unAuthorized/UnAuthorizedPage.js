import React from "react";
import { useEffect } from "react";
import Publiclayout from "../../layouts/PublicLayout";
import PrivateLayout from "../../layouts/PrivateLayout";

const UnAuthorizedPage = ({ history }) => {
  // if user, return now found with privateLayout, otherwise publiclayout-

  useEffect(() => {
    setTimeout(() => {
      history.replace("/");
    }, 1000);
  }, [history]);

  return (
    <Publiclayout>
      <div>UnAuthorizedPage - You will be redirected ...</div>
    </Publiclayout>
  );
};

export default UnAuthorizedPage;

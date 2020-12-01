import React from "react";
import Publiclayout from "../../layouts/PublicLayout";
import PrivateLayout from "../../layouts/PrivateLayout";

const NotFoundPage = () => {
  // if user, return now found with privateLayout, otherwise publiclayout-

  return (
    <Publiclayout>
      <div>NotFoundPage</div>
    </Publiclayout>
  );
};

export default NotFoundPage;

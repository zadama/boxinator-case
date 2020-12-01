import React from "react";
import useTest from "./useTest";

import PublicLayout from "../../layouts/PublicLayout";

const LoginPage = () => {
  const res = useTest();

  console.log(res);
  console.log("LOGIN PAGE");
  return (
    <PublicLayout>
      <div>LoginPage</div>
    </PublicLayout>
  );
};

export default LoginPage;

import React from "react";

import PublicLayout from "../../layouts/PublicLayout";
import { getAllAccounts } from "../../api/fetchUser";
import { useEffect } from "react";
import { useState } from "react";

const LoginPage = () => {
  const [state, setState] = useState(null);

  const displayAllAccounts = async () => {
    try {
      let { data } = await getAllAccounts();

      setState(data.msg);
    } catch (error) {
      if (error.response.status === 404) {
        console.log(error.response.data.status);

        setState(error.response.data.status);
      }
    }
  };

  useEffect(() => {
    displayAllAccounts();
  }, []);

  return (
    <PublicLayout>
      <div>LoginPage</div>

      {state ? (
        <div> Message from API: {state}</div>
      ) : (
        <div>Loading request...</div>
      )}
    </PublicLayout>
  );
};

export default LoginPage;

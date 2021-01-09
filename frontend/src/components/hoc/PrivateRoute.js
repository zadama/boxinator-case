import React, { useEffect } from "react";
import { Redirect, Route, useHistory, useLocation } from "react-router-dom";

import { useAuth } from "../../context/auth";
import PageLoader from "../../components/loader";
import { UnAuthorizedPage } from "../../pages";

const PrivateRoute = ({ component: Component, requiredRoles, ...rest }) => {
  const location = useLocation();
  const history = useHistory();
  const auth = useAuth();

  useEffect(() => {
    if (auth.user === false) {
      history.replace("/login");
    }
  }, [auth]);

  if (!auth.user) {
    return <PageLoader />;
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        if (auth.user) {
          return requiredRoles.includes(auth.user.role) ? (
            <Component {...props} />
          ) : (
            <UnAuthorizedPage {...props} />
          );
        }
      }}
    />
  );
};
export default PrivateRoute;

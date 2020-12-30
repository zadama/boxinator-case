import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import {
  AddShipmentPage,
  AdminPage,
  LoginPage,
  NotFoundPage,
  RegisterPage,
  UserShipmentDetailsPage,
} from "./pages";

import PrivateRoute from "./components/hoc/PrivateRoute";
import { ADMIN, USER, GUEST } from "./utils/roles";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />

        <PrivateRoute
          exact={true}
          path="/add-shipment"
          requiredRoles={[ADMIN, USER, GUEST]}
          component={AddShipmentPage}
        />
        <PrivateRoute
          exact={true}
          path="/admin-dashboard"
          requiredRoles={[ADMIN]}
          component={AdminPage}
        />
        <PrivateRoute
          exact={true}
          path="/handle-shipments"
          requiredRoles={[USER]}
          component={UserShipmentDetailsPage}
        />

        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  );
}

export default App;

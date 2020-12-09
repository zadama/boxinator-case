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
} from "./pages";
import PrivateRoute from "./components/hoc/PrivateRoute";
import { ADMIN, USER, GUEST } from "./utils/roles";
import CountryPage from "./pages/country/CountryPage";

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
          requiredRoles={[ADMIN, USER]}
          component={AddShipmentPage}
        />
        <PrivateRoute
          exact={true}
          path="/admin-dashboard"
          requiredRoles={[ADMIN]}
          component={AdminPage}
        />
        <Route path="/admin-dashboard/country"
        exact={true}
        component={CountryPage}/>
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  );
}

export default App;

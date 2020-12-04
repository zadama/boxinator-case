import React from "react";
import "./style.scss";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import PublicLayout from "../../layouts/PublicLayout";
import { getAllAccounts, createUser } from "../../api/user";
import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../../context/auth";
import { Redirect } from "react-router-dom";
import { ADMIN, USER } from "../../utils/roles";
import PageLoader from "../../components/loader";

const LoginPage = ({ history }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  /*
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
  };*/

  const handleLogin = async (e) => {
    setIsLoading(true);

    try {
      // const res = await createUser(email, password);
      //console.log(res);

      const loggedInUser = await login(email, password);
    } catch (error) {
      console.log(error.code);

      setErrorMessage("Could not login: " + error.code);
    } finally {
      setIsLoading(false);
    }
  };

  if (user === null || isLoading) {
    return <PageLoader />;
  }

  if (user && user.role === ADMIN) {
    return <Redirect to="admin-dashboard" />;
  }
  if (user && user.role === USER) {
    return <Redirect to="add-shipment" />;
  }

  return (
    <PublicLayout>
      <div className="login">
        {errorMessage}
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
            type="email"
            placeholder="Enter email"
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
            type="password"
            placeholder="Password"
          />
        </Form.Group>

        <Button onClick={handleLogin} variant="primary" type="submit">
          Submit
        </Button>
      </div>
    </PublicLayout>
  );
};

export default LoginPage;

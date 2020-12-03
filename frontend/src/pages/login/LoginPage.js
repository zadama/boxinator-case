import React from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import PublicLayout from "../../layouts/PublicLayout";
import { getAllAccounts, createUser } from "../../api/user";
import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../../context/auth";

const LoginPage = ({ history }) => {
  const { login } = useAuth();

  const [state, setState] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      {password} ,{email}
      <div>
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

        <Button
          onClick={async () => {
            try {
              // const res = await createUser(email, password);
              //console.log(res);

              login(email, password);
              history.push("/admin-dashboard");
            } catch (error) {
              console.log(error.response);
            }
          }}
          variant="primary"
          type="submit"
        >
          Submit
        </Button>
      </div>
    </PublicLayout>
  );
};

export default LoginPage;

import React from "react";
import { useForm } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

// fixa modal på samma sätt som i register här, och ta ut formen + kolla vf efter register vi
// hamnar i login först och inte direkt /add-shipment

const LoginForm = ({ handleLogin }) => {
  const { register, handleSubmit, errors } = useForm();

  return (
    <form className="form" onSubmit={handleSubmit(handleLogin)}>
      <div className="custom-form-group">
        <label className="label">Email</label>
        <input
          type="email"
          placeholder="Email"
          className="input"
          name="email"
          ref={register({
            required: true,
            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
        ></input>

        {errors.email?.type === "required" && (
          <span className="error-span">Please enter your email.</span>
        )}
        {errors.email?.type === "pattern" && (
          <span className="error-span">Invalid email format.</span>
        )}

        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </div>

      <div className="custom-form-group">
        <label className="label">Password</label>
        <input
          type="password"
          placeholder="Password"
          className="input"
          name="password"
          ref={register({
            required: true,
          })}
        ></input>
        {errors.password?.type === "required" && (
          <span className="error-span">Please enter your password.</span>
        )}
      </div>
      <Button className="btn" variant="primary" type="submit">
        Login
      </Button>
    </form>
  );
};

export default LoginForm;

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
            pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
          })}
        ></input>

        {errors.email && <span className="error-span">Invalid Email</span>}

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
            minLength: {
              value: 6,
              message: "Password should be at-least 6 characters.",
            },
          })}
        ></input>
        {errors.password && (
          <span className="error-span">
            {errors.password.message
              ? errors.password.message
              : "Invalid Password"}
          </span>
        )}
      </div>
      <Button className="btn" variant="primary" type="submit">
        Login
      </Button>
    </form>
  );
};

export default LoginForm;

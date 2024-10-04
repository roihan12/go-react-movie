import React from "react";
import Input from "./form/Input";
import { useNavigate, useOutletContext } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { setJwtToken } = useOutletContext();
  const { setAlertMessage } = useOutletContext();
  const { setAlertClassName } = useOutletContext();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(email, password);
    if (email === "admin@example.com") {
      setJwtToken("abc");
      setAlertClassName("d-none");
      setAlertMessage("");
      navigate("/");
    } else {
      setAlertClassName("alert-danger");
      setAlertMessage("Invalid Credentials");
    }
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h2>Login</h2>
      <hr />

      <form onSubmit={handleSubmit}>
        <Input
          title="Email Address"
          type="email"
          name="email"
          className="form-control"
          autoComplete="email-new"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          title="Password"
          type="password"
          name="password"
          className="form-control"
          autoComplete="password-new"
          onChange={(e) => setPassword(e.target.value)}
        />
        <hr />

        <input type="submit" value="Login" className="btn btn-primary" />
      </form>
    </div>
  );
};

export default Login;

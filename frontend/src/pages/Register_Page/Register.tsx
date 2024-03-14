import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const body = { username, password, email }; // Changed from username to description
      const response = await fetch("http://localhost:4000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      window.location.assign("/login"); //redirects to login after a successful user registration
    } catch (err) {
      console.error((err as Error).message);
    }
  };

return (
  <Fragment>
    <div className="container">
      <h1 className="text-center mt-5">MISK</h1>
      <div className="card mt-5">
        <div className="card-body">
          <h2 className="text-center mb-4">Sign Up</h2>
          <form onSubmit={onSubmitForm}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter Username"
               />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter Password"
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter Email"
              />
            </div>
            <button className="btn btn-primary btn-block">Register</button>
          </form>
        </div>
      </div>
      <div className="text-center mt-3">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  </Fragment>
  );
}

export default Register;

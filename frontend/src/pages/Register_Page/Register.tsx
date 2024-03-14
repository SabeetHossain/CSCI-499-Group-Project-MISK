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

      window.location.assign("/");
    } catch (err) {
      console.error((err as Error).message);
    }
  };

  return (
    <Fragment>
      <h1 className="text-center mt-5">MISK</h1>
      <h2 className="text-center mt-5">Sign Up</h2>
      <form className="d-flex mt-5" onSubmit={onSubmitForm}>
        <input
          type="text"
          className="form-control"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Enter Username"
        />
        <input
          type="text"
          className="form-control"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter Password"
        />
        <input
          type="text"
          className="form-control"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter Email"
        />
        <button type="submit" className="btn btn-success">Register</button>
      </form>
    </Fragment>
  );
}

export default Register;

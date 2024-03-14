import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("submitted");
    // e.preventDefault();
    // try {
    //   const body = { username, password, email }; // Changed from username to description

    //   const response = await fetch("http://localhost:4000/users", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(body)
    //   });

    //   window.location.assign("/");
    // } catch (err) {
    //   console.error((err as Error).message);
    // }
  };

return (
  <Fragment>
    <div className="container">
      <h1 className="text-center mt-5">MISK</h1>
      <div className="card mt-5">
        <div className="card-body">
          <h2 className="text-center mb-4">Sign In</h2>
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
            <button className="btn btn-primary btn-block">Login</button>
          </form>
        </div>
      </div>
      <div className="text-center mt-3">
        Don't have an account? <Link to="/register">Register</Link>
      </div>
    </div>
  </Fragment>
  );
}

export default Login;
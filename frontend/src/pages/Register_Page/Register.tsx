import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");


  const onSubmitForm = async e => {
      e.preventDefault(); //prevents refresh on submit
       console.log("submitted");
    }


  return (
    <div>
      <div className="signup-page">
        <header>
          <h1>MISK</h1>
        </header>
        <div className="signup-container">
          <div>
            <h2>Sign Up</h2>
            <form className="d-flex mt-5" onSubmit={onSubmitForm}>
                <input type = "text" className="form-control" value ={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter Username"
                />
                <input type="submit" value="Register" />
            </form>
            <div>
              <Link to="/Login">
                Already have an account? Sign In Here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

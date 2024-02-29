import { Link } from "react-router-dom";
import React, { useState } from "react";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  return (
  <div>
      <div className="login-page">
        <h1>MISK</h1>
        <div className="signin-container">
          <div>
            <h2>Sign In</h2>
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
              />
            </div>
            <div>
              <button>sign in</button>
            </div>
            <div>
              <Link to="/Register">Or Sign Up Here!</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
   );
};

export default Login;

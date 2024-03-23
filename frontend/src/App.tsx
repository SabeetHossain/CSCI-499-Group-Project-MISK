import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home_Page/Home";
import Register from "./pages/Register_Page/Register";
import Login from "./pages/Login_Page/Login";
import Subscribe from "./pages/Subscribe_Page/Subscribe"
import Profile from "./pages/Profile_Page/Profile";

import BasicButtons from "./materialui.js";

function App() {
  return (
    <>
      <div className="App">
        <BasicButtons/>
        Hello world
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="profile" element={<Profile />} />
        <Route path="subscribe" element={<Subscribe />} />
      </Routes>
    </>
  );
}

export default App;

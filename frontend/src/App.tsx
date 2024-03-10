import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home_Page/Home";
import Register from "./pages/Register_Page/Register";
import Login from "./pages/Login_Page/Login";
import Subscribe from "./pages/Subscribe_Page/Subscribe"



function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="subscribe" element={<Subscribe />} />
      </Routes>
    </>
  );
}

export default App;

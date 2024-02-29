import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home_Page/Home";
import Register from "./pages/Register_Page/Register";
import Login from "./pages/Login_Page/Login";





function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;

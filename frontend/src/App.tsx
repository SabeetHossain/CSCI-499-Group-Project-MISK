import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home_Page/Home";
import Register from "./pages/Register_Page/Register";
import Login from "./pages/Login_Page/Login";
import Subscribe from "./pages/Subscribe_Page/Subscribe"
import Profile from "./pages/Profile_Page/Profile";
import Dashboard from "./pages/Dashboard/Dashboard";
import useToken from './useToken';


// function setToken(userToken: string | object) {
//   sessionStorage.setItem('token', JSON.stringify(userToken));
// }



// function getToken() {
//   const tokenString = sessionStorage.getItem('token') ?? '';
//   const userToken = JSON.parse(tokenString);
//   return userToken?.token
// }

// function getToken() {
//   const tokenString = sessionStorage.getItem('token');
//   if (tokenString) {
//     const userToken = JSON.parse(tokenString);
//     return userToken?.token;
//   }
//   return null; // or return an empty string as per your requirement
// }


function App() {

  const { token, setToken } = useToken();

  if(!token) {
    return <Login setToken={setToken} />
  }
  
  return (
    <div className="wrapper">
      <h1>Application</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="profile" element={<Profile />} />
        <Route path="subscribe" element={<Subscribe />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Routes>
    </div>
    
  );
}

export default App;
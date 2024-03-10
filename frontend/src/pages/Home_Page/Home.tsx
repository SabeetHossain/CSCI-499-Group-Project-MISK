import React from "react";
import Logo from "../../assets/Logo.png"; //requires es6 imports to use, compiles after i made changes to tsconfig adding in es6.
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
      <div className="home-page">
        <h1>MISK</h1>
        <p> All your stocks, cryptocurrency, and related news conveniently in one place to unlock your financial potential! </p>
        <div className="home-signin-buttons">
          <Link to="/Login" className="home-signin-button"> Sign In </Link>
          <Link to="/Register" className="home-signup-button"> Sign Up </Link>
          <Link to= "/Subscribe" className="ticker-subscribe-button"> Subscribe </Link>          
        </div>
      </div>
  );
};

export default Home;

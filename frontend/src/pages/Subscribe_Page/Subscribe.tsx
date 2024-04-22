import React, { Fragment, useState, useEffect} from "react";

import "./Subscribe.css";
import { useAuth } from "../../useAuth"; // Import useAuth hook
import { useNavigate } from 'react-router-dom';

function Subscribe() {
  const [description, setDescription] = useState("");
  const [ticker, setTicker] = useState(""); 
  const { verifyToken } = useAuth(); // Get the isLoggedIn state from useAuth hook
  const navigate = useNavigate(); // Get the navigate function from useNavigate hook


  useEffect(  () => {
    const loggedInCheck = async () => {
      console.log("INSIDE OF SUBCRIBE: grabbing token")
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        console.log("INSIDE OF SUBCRIBE: found token calling VERIFY")
        // Perform the initial authentication check only when the component mounts
      
        let data = await verifyToken(storedToken);
        console.log("testing123")
        console.log(data)
        console.log("INSIDE OF SUBCRIBE: finished")
        if(!data['authenticated'] ){
          navigate('/login');
        } 

      } else {
        navigate('/login')
      }
     
    }
    loggedInCheck()
   });

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

      
      try {
        const body = { tickers: ticker }; 
        const response = await fetch("http://localhost:4000/users/ticker/" + description , {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          console.log('Stock ticker updated successfully!');
          window.location.assign("/");
        } else {
          console.error('Error updating stock ticker:', response.statusText);
          // maybe display an error message directly to the user sometime
        }
      } catch (err) {
        console.error((err as Error).message); // other errors (e.g., network issues, unexpected responses).
      }
  
  };

  return (
    <Fragment>
      <h1 className="text-center mt-5">MISK</h1>
      <h2 className="text-center mt-5">Subscribe To Tickers!!</h2>
      <form className="d-flex mt-5" onSubmit={onSubmitForm}>
        <input
          type="text"
          className="form-control"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Enter Username"
        />
        <input
          type="text"
          className="form-control"
          value={ticker}
          onChange={e => setTicker(e.target.value)}
          placeholder="Enter Stock Ticker"
        />
        <button className="btn btn-success">Subscribe</button>
      </form>
    </Fragment>
  );

}
export default Subscribe;




/*
import React, { Fragment, useState, useEffect } from "react";
import { useRequireAuth } from '../../useRequireAuth'; // Import the useRequireAuth hook
import "./Subscribe.css";



function Subscribe() {



  const [description, setDescription] = useState("");
  const [ticker, setTicker] = useState(""); 
  const requireAuth = useRequireAuth(); // Use the useRequireAuth hook
  //const { requireAuth, isLoggedIn, token } = useRequireAuth();





  useEffect(() => {
    requireAuth(); // Ensure user is logged in before rendering the component
    console.log("WHAT IS GOING ON IN SUBSCRIBE", requireAuth)
  }, [requireAuth]);



  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    if(isLoggedIn){
      const navigate = useNavigate();
      navigate('/login')
    }
    else{
    e.preventDefault();
    try {
      const body = { tickers: ticker }; 
      const response = await fetch("http://localhost:4000/users/ticker/" + description , {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        console.log('Stock ticker updated successfully!');
        window.location.assign("/");
      } else {
        console.error('Error updating stock ticker:', response.statusText);
        // maybe display an error message directly to the user sometime
      }
    } catch (err) {
      console.error((err as Error).message); // other errors (e.g., network issues, unexpected responses).
    }
  };

  return (
    <Fragment>
      <h1 className="text-center mt-5">MISK</h1>
      <h2 className="text-center mt-5">Subscribe To Tickers!!</h2>
      <form className="d-flex mt-5" onSubmit={onSubmitForm}>
        <input
          type="text"
          className="form-control"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Enter Username"
        />
        <input
          type="text"
          className="form-control"
          value={ticker}
          onChange={e => setTicker(e.target.value)}
          placeholder="Enter Stock Ticker"
        />
        <button className="btn btn-success">Subscribe</button>
      </form>
    </Fragment>
  );
  
}
}

export default Subscribe;
*/
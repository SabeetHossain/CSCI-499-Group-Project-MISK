import React, { Fragment, useState } from "react";
import "./Subscribe.css";

function Subscribe() {
  const [description, setDescription] = useState("");
  const [ticker, setTicker] = useState(""); 

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const body = { tickers:ticker }; 
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
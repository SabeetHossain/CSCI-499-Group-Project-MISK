// @ts-check

import express from "express";
import cors from "cors";
import pool from "./db";

//const pool = require("./db").default;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


//ROUTES//

//create a username

app.post("/users", async(req: express.Request, res: express.Response) => {
    try{
        const { description } = req.body;
        const newUsername = await pool.query(
        "INSERT INTO users (description) VALUES($1) RETURNING *",
        [description]
        );

        res.json(newUsername.rows[0]); //might change this 
    } catch(err) {
      console.error((err as Error).message);

    }
});





//get all usernames

app.get("/users", async(req: express.Request, res: express.Response) => {
    try {
        const allUsernames = await pool.query("SELECT * FROM users");
        res.json(allUsernames.rows);
    } catch (err) {
      console.error((err as Error).message);

    }
});

//get a username

app.get("/users/:aUser", async(req: express.Request, res: express.Response) => {
  try {
    const { aUser } = req.params;
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [aUser]);

    res.json(user.rows);
  } catch (err) {
    console.error((err as Error).message);

  }
})


//update a username

app.put("/users/:aUser", async(req: express.Request, res: express.Response) =>{
  try {
    const { aUser } = req.params;
    const { description } = req.body;
    const updateUsername = await pool.query("UPDATE users SET description = $1 WHERE user_id = $2",
    [description, aUser]);

    res.json("Username was updated!")
  } catch (err) {
    console.error((err as Error).message);

  }
})


//update a ticker

app.put("/users/ticker/:description", async(req: express.Request, res: express.Response) =>{
  try {
    const { description } = req.params;
    const { tickers } = req.body;
    const updateUsername = await pool.query("UPDATE users SET tickers = $1 WHERE description = $2",
    [tickers, description]);

    res.json("Username was updated!")
  } catch (err) {
    console.error((err as Error).message);

  }
})


//delete a username

app.delete("/users/:aUser", async (req: express.Request, res: express.Response) => {
  try {
    const { aUser } = req.params;
    const deleteUsername = await pool.query("DELETE FROM users WHERE user_id = $1",[
      aUser
    ]);

    res.json("Username was deleted!")
  } catch (err) {
    console.error((err as Error).message);

  }
})

//start the server

//to run, type in terminal:
//node index.js
//const PORT = process.env.PORT || 3001;
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
// @ts-check

import express from "express";
import cors from "cors";
import pool from "./db";

const app = express();
const bcrypt = require('bcrypt'); //for password hashing. run "npm install bcrypt"

// Middleware
app.use(cors());
app.use(express.json());


//-----------------------------------------------------ROUTES FOR USER INFORMATION-----------------------------------------------------//


//-----------------------------------------------------ROUTES FOR USERNAMES------------------------------------------------------------//




//Create a new user (with username and password)

app.post("/users", async(req: express.Request, res: express.Response) => {
    try {
      const { username, password, email } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      //insert new user into database
      const newUser = await pool.query(
          "INSERT INTO users (username, password, email) VALUES($1, $2, $3) RETURNING *",
          [username, hashedPassword, email]
      );

        res.json(newUser.rows[0]);
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
    const { username } = req.body;
    const updateUsername = await pool.query("UPDATE users SET username = $1 WHERE user_id = $2",
    [username, aUser]);

    res.json("Username was updated!")
  } catch (err) {
    console.error((err as Error).message);

  }
})




//update an email
//postman: http://localhost:4000/users/45/email

app.put("/users/:userId/email", async(req: express.Request, res: express.Response) => {
  try {
      const { userId } = req.params;
      const { email } = req.body;

      const updateUserEmail = await pool.query(
          "UPDATE users SET email = $1 WHERE user_id = $2",
          [email, userId]
      );

      res.json("Email was updated!");
  } catch (err) {
      console.error((err as Error).message);
  }
});



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




//-----------------------------------------------------ROUTES FOR TICKERS------------------------------------------------------------//

//update a ticker

app.put("/users/ticker/:description", async(req: express.Request, res: express.Response) =>{
  try {
    const { description } = req.params;
    const newTicker = req.body.tickers;

    const user = await pool.query("SELECT tickers FROM users WHERE description = $1", [description]);
    const currentTickers = user.rows[0].tickers;

    const updatedTickers = currentTickers ? `${currentTickers}, ${newTicker}` : newTicker;

    const updateUsername = await pool.query("UPDATE users SET tickers = $1 WHERE description = $2",
    [updatedTickers, description]);

    res.json("Ticker was updated!")
  } catch (err) {
    console.error((err as Error).message);
  }
})





//START THE SERVER//
/*
Install TypeScript globally if you haven't already done so:
npm install -g typescript

Install dependencies:
cd server
npm install

Run the server:
ts-node index.ts
*/

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
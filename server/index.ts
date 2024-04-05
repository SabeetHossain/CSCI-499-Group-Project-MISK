// @ts-check

import express from "express";
import cors from "cors";
import pool from "./db";
import dotenv from 'dotenv';
import path from 'path';

const app = express();
const bcrypt = require('bcrypt'); //for password hashing. run "npm install bcrypt"
const jwt = require('jsonwebtoken');

const envPath = path.resolve('/home/capstone/CSCI-499-Group-Project-MISK/.env');
dotenv.config({ path: envPath });
// Middleware
app.use(cors());
app.use(express.json());

//app.use(cookieParser());

//------------------------------------------------ROUTES FOR LOGINS----------------------------------------------------------------//





//LOGIN ROUTE

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username exists
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Verify password
    const hashedPassword = user.rows[0].password;
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.rows[0].user_id }, process.env.JWT_SECRET, { expiresIn: 300 }); //put this into the .env file eventually
    //res.json({ token });

    // Remove the password from the user object before sending it in the response
    const { password: userPassword, ...userInfo } = user.rows[0];

    // Send response with token and user info
    res.json({ authenticated: true, token, userInfo });

  } catch (err) {
    console.error((err as Error).message);
    res.status(500).json({ message: "Server error" });
  }
});





declare global {
  namespace Express {
    interface Request {
      userID?: string; // Define userID property as optional, solves typescript error in verifyJWT function under req.userID
    }
  }
}

const verifyJWT = (req: express.Request, res: express.Response, next: express.NextFunction)=> {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(401).json({ authenticated: false, message: "No token provided" });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err: Error | null, decoded: any) => {
      if (err) {
        return res.status(401).json({ authenticated: false, message: "Failed to authenticate token" });
      } else {
        // Store decoded user ID in request object for further processing
        req.userID = decoded.userId;
        next();
      }
    });
  }
};


app.get('/isUserAuth', verifyJWT, (req,res) =>{
  res.send("Congratgulations, you are authenticated!");
});






//-----------------------------------------------------ROUTES FOR USERNAMES/EMAILS/PASSWORDS------------------------------------------------------------//




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
        // Check if any usernames were found
        if (allUsernames.rows.length > 0) {
          res.json(allUsernames.rows);
        }
        else {
          res.status(404).json({ message: "No usernames found" });
        }

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

app.put("/users/ticker/:username", async(req: express.Request, res: express.Response) =>{
  try {
    const { username } = req.params;
    const newTicker = req.body.tickers;

    const user = await pool.query("SELECT tickers FROM users WHERE username = $1", [username]);
    const currentTickers = user.rows[0].tickers;

    const updatedTickers = currentTickers ? `${currentTickers}, ${newTicker}` : newTicker;

    const updateUsername = await pool.query("UPDATE users SET tickers = $1 WHERE username = $2",
    [updatedTickers, username]);

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
or
nodemon index.ts
*/

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
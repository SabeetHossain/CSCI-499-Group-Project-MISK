const express = require('express');
const app = express();
//const cors = require("cors");
const pool = require("./db");


//middleware
//app.use(cors());
app.use(express.json()); //req.body
// //route handler
// app.get('/', (req, res) => {
//   res.send('This is the MISK server.');
// });


//ROUTES//

//create a username

app.post("/users", async(req, res) => {
    try{
        const { description } = req.body;
        const newUsername = await pool.query(
        "INSERT INTO users (description) VALUES($1) RETURNING *",
        [description]
        );

        res.json(newUsername.rows[0]); //might change this
    } catch(err) {
        console.error(err.message);
    }
});

//get all usernames

app.get("/users", async(req, res) => {
    try {
        const allUsernames = await pool.query("SELECT * FROM users");
        res.json(allUsernames.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//get a username

app.get("/users/:aUser", async(req, res) => {
  try {
    const { aUser } = req.params;
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [aUser]);

    res.json(user.rows);
  } catch (err) {
    console.error(err.message);
  }
})


//update a username

app.put("/users/:aUser", async(req, res) =>{
  try {
    const { aUser } = req.params;
    const { description } = req.body;
    const updateUsername = await pool.query("UPDATE users SET description = $1 WHERE user_id = $2",
    [description, aUser]);

    res.json("Username was updated!")
  } catch (err) {
    console.error(err.message);
  }
})



//delete a username

app.delete("/users/:aUser", async (req, res) => {
  try {
    const { aUser } = req.params;
    const deleteUsername = await pool.query("DELETE FROM users WHERE user_id = $1",[
      aUser
    ]);

    res.json("Username was deleted!")
  } catch (err) {
    console.error(err.message);
  }
})

//start the server
//const PORT = process.env.PORT || 3001;
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});


/*
const express = require('express');

const app = express();

//route handler
app.get('/', (req, res) => {
  res.send('This is the MISK server.');
});

//start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//---------------------------

const express = require('express');
const pool = require('./databasePG'); // Import database configuration

const app = express();

// Endpoint for testing database connection
app.get('/test', async (req, res) => {
  try {
    // Query the database to test the connection
    const result = await pool.query('SELECT $1::text as message', ['Hello, PostgreSQL!']);
    res.send(result.rows[0].message);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Internal server error');
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

*/

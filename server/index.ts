// @ts-check
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import pool from './db';
// import path from 'path';

const bodyParser = require('body-parser');
const app = express();
const bcrypt = require('bcrypt'); //for password hashing. run "npm install bcrypt"
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');
//const envPath = path.resolve('/home/capstone/CSCI-499-Group-Project-MISK/.env');
// const envPath = path.resolve('.env');
// dotenv.config({ path: envPath });
dotenv.config();


// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json())
//app.use(cookieParser());

//------------------------------------------------ROUTES FOR LOGINS----------------------------------------------------------------//

// Generate a random JWT secret key
const secretKey = crypto.randomBytes(32).toString('hex');

// Write the secret key to a .env file
const envFile = '.env';

// Check if .env file exists
if (!fs.existsSync(envFile)) {
  fs.writeFileSync(envFile, '');
}

// Append the JWT secret key to the .env file
//fs.appendFileSync(envFile, `JWT_SECRET=${secretKey}\n`);
// Load the environment variables from the .env file
//dotenv.config();
//console.log("JWT Secret Key:", secretKey);

const jwtSecret = process.env.JWT_SECRET;

//LOGIN ROUTE
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body; // Change from username to email
    console.log("Executing SQL query:", "SELECT * FROM users WHERE email = $1", [email]);

    // Check if email exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      console.log("email doesnt exist");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password
    const hashedPassword = user.rows[0].password;
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      console.log("wrong pw or email!");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.rows[0].user_id }, jwtSecret, { expiresIn: 600 });

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
      userID?: string;
    }
  }
}
const verifyJWT = (req: express.Request, res: express.Response, next: express.NextFunction)=> {
  const token = req.body['token'];
  console.log(token)
  if (!token) {
    return res.status(200).json({ authenticated: false, message: "No token provided" });
  } else {
    jwt.verify(token, jwtSecret, (err: Error | null, decoded: any) => {
      if (err) {
        return res.status(200).json({ authenticated: false, message: "Failed to authenticate token" });
      } else {
        //store decoded user ID in request object for further processing
        req.userID = decoded.userId;
        next();
      }
    });
  }
};


app.post('/isUserAuth', verifyJWT, (req,res) =>{

  res.status(200).json({authenticated: true, message: "this user is successfully authenticated."});
  console.log("this user is successfully authenticated.")
});

// Logout route
app.post("/logout", (req, res) => {
  //stub route for now
  res.json({ message: "Logout successful" });
});

//-----------------------------------------------------ROUTES FOR USERNAMES/EMAILS/PASSWORDS------------------------------------------------------------//

//-----------------------------------------------------ROUTES FOR USER INFORMATION-----------------------------------------------------//

//-----------------------------------------------------ROUTES FOR USERNAMES------------------------------------------------------------//

//Create a new user (with username and password)

app.post('/users', async (req: express.Request, res: express.Response) => {
	try {
		const { username, password, email } = req.body;

		const hashedPassword = await bcrypt.hash(password, 10);

		//insert new user into database
		const newUser = await pool.query(
			'INSERT INTO users (username, password, email) VALUES($1, $2, $3) RETURNING *',
			[username, hashedPassword, email],
		);
		console.log(newUser.rows[0]);
		res.json(newUser.rows[0]);
	} catch (err) {
		console.error((err as Error).message);
	}
});

//get all usernames
app.get('/users', async (req: express.Request, res: express.Response) => {
	try {
		const allUsernames = await pool.query('SELECT * FROM users');
		// Check if any usernames were found
		if (allUsernames.rows.length > 0) {
			res.json(allUsernames.rows);
		} else {
			res.status(404).json({ message: 'No usernames found' });
		}
	} catch (err) {
		console.error((err as Error).message);
	}
});

//get a username
app.get(
	'/users/:aUser',
	async (req: express.Request, res: express.Response) => {
		try {
			const { aUser } = req.params;
			const user = await pool.query(
				'SELECT * FROM users WHERE user_id = $1',
				[aUser],
			);

			res.json(user.rows);
		} catch (err) {
			console.error((err as Error).message);
		}
	},
);

//update a username
// app.put(
// 	'/users/:aUser',
// 	async (req: express.Request, res: express.Response) => {
// 		try {
// 			const { aUser } = req.params;
// 			const { username } = req.body;
// 			const updateUsername = await pool.query(
// 				'UPDATE users SET username = $1 WHERE user_id = $2',
// 				[username, aUser],
// 			);

// 			res.json('Username was updated!');
// 		} catch (err) {
// 			console.error((err as Error).message);
// 		}
// 	},
// );

//update an email
//postman: http://localhost:4000/users/45/email
app.put(
	'/users/:userId/email',
	async (req: express.Request, res: express.Response) => {
		try {
			const { userId } = req.params;
			const { email } = req.body;

			const updateUserEmail = await pool.query(
				'UPDATE users SET email = $1 WHERE user_id = $2',
				[email, userId],
			);

			res.json('Email was updated!');
		} catch (err) {
			console.error((err as Error).message);
		}
	},
);

//delete a username
app.delete(
	'/users/:aUser',
	async (req: express.Request, res: express.Response) => {
		try {
			const { aUser } = req.params;
			const deleteUsername = await pool.query(
				'DELETE FROM users WHERE user_id = $1',
				[aUser],
			);

			res.json('Username was deleted!');
		} catch (err) {
			console.error((err as Error).message);
		}
	},
);

//updating a users profile
/*
		Design Decision: If the user has multiple errors, only whichever one was caught first will 
		                 be sent to the user because as soon as a user based error is found 
						 a res.status is returned.
*/
/*new Todo: having checks for valid email strings and password strings */
app.put('/users/:userId', async (req: express.Request, res: express.Response) =>{
	try{
		let usernameupdated:boolean = false;
		let passwordupdated:boolean = false;
		let emailupdated:boolean = false;
		let errorOccurred:boolean = false;
		// let usernameupdated:boolean = false;
		let statusValue:string = 'placeholder'
		let statusMessage:string = 'placeholder'
		let credentialsUpdated:boolean = false;
		let numUpdates:number = 0;
		// const allHashedPasswords = await pool.query('SELECT password FROM users');
		// console.log('all hashed passwords');
		// console.log(allHashedPasswords);
		console.log('this is req.params: ' + req.params);
		console.log('this is req.body: '+ req.body);

		const { userId } = req.params;
		const user = await pool.query(
			'SELECT * FROM users WHERE user_id = $1',
			[userId],
		);
		const {username, currentPassword, newPassword, email} = req.body;
		console.log('username: ' + username);
		console.log('current password: '+ currentPassword);
		console.log('new password: '+newPassword);
		console.log('email: '+email);
		// console.log('users username: '+ user.rows[0].username);
		//error checks:
		if(username != "")
		{
			//if the user submits the same username they currently have
			if(username === user.rows[0].username)
			{
				console.log('same username submitted');
				errorOccurred = true;
				statusMessage = 'new username cannot match current username!';
				statusValue = 'error';
				return res.status(400).json({message: statusMessage, value: statusValue});	
			}		

			/* usernames should be unique. if the submitted username matches another one 
			   in the database, returns error.*/
			const existingUsername = await pool.query(
				'SELECT * FROM users WHERE user_id != $1 AND username = $2',
				[userId, username]
			);

			if (existingUsername.rows.length > 0) {
				errorOccurred = true;
				statusMessage = 'username belongs to another account!';
				statusValue = 'error';
				return res.status(400).json({message: statusMessage, value: statusValue});	
			}
		}
		if(currentPassword != "")
		{
			
				const hashedPassword = user.rows[0].password;
				console.log('hashed'+hashedPassword);
				const isPasswordValid = await bcrypt.compare(currentPassword, hashedPassword);
				console.log('ispasswordvalid '+isPasswordValid)
				//checks if current password submitted matches the one in database
				if (!isPasswordValid) {
					console.log("current password does not match password in database");
					errorOccurred = true;
					statusMessage = 'current password is incorrect!';
					statusValue = 'error';
					return res.status(400).json({message: statusMessage, value: statusValue});	
				}
			
			if(newPassword=="")
			{
				console.log("new password cant be left blank");
				errorOccurred = true;
				statusMessage = 'new password cannot be left blank if you are changing your password';
				statusValue = 'error';
				return res.status(400).json({message: statusMessage, value: statusValue});	

			}
		}
		if(newPassword != "")
		{
			const hashedPassword = user.rows[0].password;
			console.log('hashed'+hashedPassword);
			const isPasswordValid = await bcrypt.compare(currentPassword, hashedPassword);
			console.log('ispasswordvalid '+isPasswordValid)
			//checks if current password submitted matches the one in database
			if (!isPasswordValid) {
				console.log("current password does not match password in database");
				errorOccurred = true;
				statusMessage = 'current password is incorrect!';
				statusValue = 'error';
				return res.status(400).json({message: statusMessage, value: statusValue});	
			}

			//if the submitted current password does match, checks if the submitted new password is the same as the current password.
			else if(currentPassword === newPassword)
			{
				console.log('matching current and new passwords');
				errorOccurred = true;
				statusMessage = 'new password cannot match current password!';
				statusValue = 'error';
				return res.status(400).json({message: statusMessage, value: statusValue});	
			}
		}
		if(email != "")
		{
			//if submitted email matches the one in database than nothing changes, that is a user side error.
			if(email === user.rows[0].email)
			{
				console.log('same email submitted');
				errorOccurred = true;
				statusMessage = 'new email cannot match current email';
				statusValue = 'error';
				return res.status(400).json({message: statusMessage, value: statusValue});
			}
			
			// checks if submitted email is unique. if it matches another users email, returns error.
			const existingEmail = await pool.query(
				'SELECT * FROM users WHERE user_id != $1 AND email = $2',
				[userId, email]
			);
			if (existingEmail.rows.length > 0) {
				console.log("email exists in database");
				errorOccurred=true;
				statusMessage = 'email belongs to another account';
				statusValue = 'error';
				return res.status(400).json({message: statusMessage, value: statusValue});
			}
		}
		//now that all the error checks are done the updating will begin.
		if(errorOccurred == false)
		{
			if(username != "")
			{
				const updateUsername = await pool.query(
					'UPDATE users SET username = $1 WHERE user_id = $2',
					[username, userId],
				);
				credentialsUpdated = true; 
				usernameupdated = true;
				numUpdates +=1;
				statusMessage= 'username was successfully updated!';
				statusValue = 'success';
				console.log('Username was updated!'+ numUpdates);
			}

			if(newPassword != "")
			{
				const newHashedPassword = await bcrypt.hash(newPassword, 10);
				const updatePassword = await pool.query(
					'UPDATE users SET password = $1 WHERE user_id = $2',
					[newHashedPassword, userId],
				);
				credentialsUpdated = true; 
				numUpdates +=1;
				statusMessage= 'password was successfully updated!';
				statusValue = 'success';
				console.log('Password was updated!');
			}
			
			if(email != "")
			{
				const updateEmail = await pool.query(
					'UPDATE users SET email = $1 WHERE user_id = $2',
					[email, userId],
				);
				credentialsUpdated = true; 
				numUpdates +=1;
				statusMessage= 'email was successfully updated!';
				statusValue = 'success';
				console.log('Email was updated!');
			}
		}

		//if more than one item was updated, and all were succesfully updated leave a general success message
		if(numUpdates > 1)
		{
			statusMessage= 'profile was successfully updated!';
			statusValue = 'success';
		}

		if(credentialsUpdated == true)
		{
			statusValue='success';
			// const { password: userPassword, ...userInfo } = user.rows[0];
			const token = jwt.sign({ userId: user.rows[0].user_id }, jwtSecret, { expiresIn: 600 });
			console.log('profile successfully updated and token sent')
			//visual studio is showing status is some keyword so im avoiding name something status:
			res.json({message: statusMessage, value: statusValue, authenticated: true, token });
		}
		else
		{
			if(numUpdates == 0)
			{
				statusMessage = 'profile is not updated because all fields were blank'
				statusValue = 'warning';
				return res.status(400).json({message: statusMessage, value: statusValue});
			}
			else
			{
				//this else is for any other edge case in which the profile fails to update
				statusMessage = 'something went wrong. please try again';
				statusValue =  'warning';
				return res.status(400).json({message: statusMessage, value: statusValue});
			}
		}
	} catch (err) {
		console.error((err as Error).message);
	}
});

//-----------------------------------------------------ROUTES FOR TICKERS------------------------------------------------------------//

//old code for updating a ticker
// app.put("/users/ticker/:username", async(req: express.Request, res: express.Response) =>{
//   try {
//     const { username } = req.params;
//     const newTicker = req.body.tickers;

//     const user = await pool.query("SELECT tickers FROM users WHERE username = $1", [username]);
//     const currentTickers = user.rows[0].tickers;

//     const updatedTickers = currentTickers ? `${currentTickers}, ${newTicker}` : newTicker;

    // const updateUsername = await pool.query("UPDATE users SET tickers = $1 WHERE username = $2",
    // [updatedTickers, username]);

//     res.json("Ticker was updated!")
//   } catch (err) {
//     console.error((err as Error).message);
//   }
// })

//I dont think this is being used
// app.put(
// 	'/users/ticker/:description',
// 	async (req: express.Request, res: express.Response) => {
// 		try {
// 			const { description } = req.params;
// 			const newTicker = req.body.tickers;

// 			const user = await pool.query(
// 				'SELECT tickers FROM users WHERE description = $1',
// 				[description],
// 			);
// 			const currentTickers = user.rows[0].tickers;

// 			const updatedTickers = currentTickers
// 				? `${currentTickers}, ${newTicker}`
// 				: newTicker;

// 			const updateUsername = await pool.query(
// 				'UPDATE users SET tickers = $1 WHERE description = $2',
// 				[updatedTickers, description],
// 			);

// 			res.json('Ticker was updated!');
// 		} catch (err) {
// 			console.error((err as Error).message);
// 		}
// 	},
// );

app.put('/users/phone/:userId', async (req: express.Request, res:express.Response) => {
	try{
		let statusValue:string = 'placeholder';
		let statusMessage:string = 'placeholder';
		console.log('this is req.params: ' + req.params);
		console.log('this is req.body: '+ req.body);

		const { userId } = req.params;
		const user = await pool.query(
			'SELECT * FROM users WHERE user_id = $1',
			[userId],
		);
		const phoneSubbed = await pool.query(
			'SELECT phonesubbed FROM users WHERE user_id = $1',
			[userId],
		);
		console.log('phonesubbed: '+phoneSubbed.rows[0].phonesubbed)
		let phoneSubscribedBody:boolean = req.body.phoneSubscribed;
		console.log('phone notifications are enabled: ' + phoneSubscribedBody);

		if(phoneSubscribedBody === true)
        {
			phoneSubscribedBody = false;
			statusMessage = 'You will no longer be getting phone notifications';
			statusValue = 'info';
        }
		else
		{
			phoneSubscribedBody = true;
			statusMessage = 'You will now be getting phone notifications!';
			statusValue = 'info';
		}
		const updatePhoneSubbed = await pool.query(
			'UPDATE users SET phonesubbed = $1 WHERE user_id = $2',
			[phoneSubscribedBody, userId],
		);
		res.json({message: statusMessage, value: statusValue});
	}
	catch (err) {
		console.error((err as Error).message);
	}
	}
);

app.put('/users/email/:userId', async (req: express.Request, res:express.Response) => {
	try{
		let statusValue:string = 'placeholder';
		let statusMessage:string = 'placeholder';
		console.log('this is req.params: ' + req.params);
		console.log('this is req.body: '+ req.body);

		const { userId } = req.params;
		const user = await pool.query(
			'SELECT * FROM users WHERE user_id = $1',
			[userId],
		);
		const emailSubbed = await pool.query(
			'SELECT emailsubbed FROM users WHERE user_id = $1',
			[userId],
		);
		console.log('emailsubbed: '+emailSubbed.rows[0].emailsubbed)
		let emailSubscribedBody:boolean = req.body.emailSubscribed;
		console.log('email notifications are enabled: ' + emailSubscribedBody);

		if(emailSubscribedBody === true)
        {
			emailSubscribedBody = false;
			statusMessage = 'You will no longer be getting email notifications';
			statusValue = 'info';
        }
		else
		{
			emailSubscribedBody = true;
			statusMessage = 'You will now be getting email notifications!';
			statusValue = 'info';
		}
		const updateEmailSubbed = await pool.query(
			'UPDATE users SET emailsubbed = $1 WHERE user_id = $2',
			[emailSubscribedBody, userId],
		);
		res.json({message: statusMessage, value: statusValue});
	}
	catch (err) {
		console.error((err as Error).message);
	}
	}
);

// get settings
app.get('/settings', async (req: express.Request, res: express.Response) => {
	try {
		const result = await pool.query('SELECT * FROM settings LIMIT 1');
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500);

		if (err instanceof Error) {
			console.error(err.message);
			res.json({ error: err.message });
		}
	}
});


// set settings
app.post('/settings', async (req: express.Request, res: express.Response) => {
	try {
		const result = await pool.query(
			`INSERT INTO settings (id, message_type) VALUES ('1', $1) ON CONFLICT (id) DO UPDATE SET message_type = EXCLUDED.message_type`,
			[req.body.message_type],
		);
		res.json(result);
	} catch (err) {
		res.status(500);

		if (err instanceof Error) {
			console.error(err.message);
			res.json({ error: err.message });
		}
	}
});

//update tickers
//postman: http://localhost:4000/users/45/tickers

app.put(
	'/users/:userId/ticker',
	async (req: express.Request, res: express.Response) => {
		try {
			const { userId } = req.params;
			const newTicker = req.body.tickers;

			const user = await pool.query(
				'SELECT tickers FROM users WHERE user_id = $1',
				[userId],
			);
			const currentTickers = user.rows[0].tickers;

			const updatedTickers = currentTickers
				? `${currentTickers}, ${newTicker}`
				: newTicker;

			const updateUsername = await pool.query(
				'UPDATE users SET tickers = $1 WHERE user_id = $2',
				[updatedTickers, userId],
			);

			res.json('Ticker was updated!');
		} catch (err) {
			console.error((err as Error).message);
		}
	},
);

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

const port = process.env.PORT || 4000;

app.listen(port, () => {
	console.log('Server is running on port '+port);
});

# CSI 499 Project - MISK

These are the instructions to download the MISK project and run it on a local machine

## Getting Started

To get started with the project, follow these instructions to set up the database and tables required for storing user data and news summaries.

### Creating the Database

First, you need to create the database. Open your postgres database management tool `psql` and execute the following SQL command:

```postgresql
CREATE DATABASE newsData;
```

### Creating Tables

After creating the database, you need to create tables to store user information and news summaries. Execute the following SQL commands to create these tables:

#### Users Table

```postgresql
CREATE TABLE users (
id SERIAL PRIMARY KEY,
username VARCHAR(255) UNIQUE NOT NULL,
password TEXT NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL,
tickers TEXT[]
);
```

#### News Summaries Table

```postgresql
CREATE TABLE news_summaries (
id SERIAL PRIMARY KEY,
summary TEXT,
tickers TEXT[],
sentiment VARCHAR(10),
level INTEGER
);
```

## Alpaca Client Changes

For the project to connect to the database and interact with external services correctly, certain configuration changes are required in `alpaca_client.py`, libraries must be installed, and specific variables at the top of the file should be updated with appropriate values.

### Python Libraries Configuration

### Installation Script

Run the following pip command in your terminal to install all required libraries:

```bash
pip install asyncio Flask flask_socketio websockets openai asyncpg aiosmtplib
```

### Postgres Configuration

The Postgres configuration within `alpaca_client.py` needs to be updated to reflect the DB setup. This includes the host, user, password, and database name. The exact values for these configurations will depend on how your system and Postgres server are set up.

#### Example Configuration

```python
username = 'postgres'
dbPass = "Your password here" #Must be changed to your postgres password
db = 'newsData'
hostname = 'localhost'
```
#### Required Variables

In addition to configuring the database connection, there are several variables at the top of alpaca_client.py that must be replaced with actual values. These are critical for the functionality related to Alpaca API, OpenAI, and Gmail notifications.

```python
openAi = "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" # OpenAI API Key
gmailPass = "xeur affl zdkr yjwg" # Gmail application-specific password
```
## Notes

- It is important to replace `"Your password here"`, the placeholder for `dbPass`, with your actual database password to ensure that the application can connect to the PostgreSQL database successfully, as well as the other respective variables
- The gmail account is set to send emails from my email account, mshvorin@gmail.com, and until the ticker subscription is implimented, unless you add a row with your email to the users table, you will be unable to recieve any emails (as you are not subscribed to them), but there is output in the console for emails being sent out.
- When connected, you should be able to see that the flask app has been ran in the console. You will see something similar to `(19168) wsgi starting up on http://127.0.0.1:5000/`, and should click on the link to connect to the webhook.

# Test PERN Stack Application

Make sure you have Node.js installed before running these commands.


## Setting Up the Database

## Step 1: Create Database

1. **Connect to PostgreSQL:** 

sudo su postgres, psql


2. **Create Database:**

CREATE DATABASE misk_info;


## Step 2: Create Table

1. **Connect to the newly created database:**

CREATE TABLE users (
user_id SERIAL PRIMARY KEY,
description VARCHAR(255)
);


This will create a PostgreSQL database named `misk_info` with a table named `users`, containing columns `user_id` and `description`.


## Server

1. **Install TypeScript globally if you haven't already done so:** 

npm install -g typescript

2. **Install dependencies:** 

cd server

npm install

3. **Run the server:** 

ts-node index.ts

## Frontend

1. **Install dependencies:** 

cd frontend

npm install

2. **Run the frontend server:** 

nodemon index.js

This will launch the web application on localhost:3000.

## Adding Your Username to the Database

1. **Access the web application:** 
Navigate to localhost:3000 in your web browser.

2. **Sign Up:** 
Click the "Sign Up" button and input your desired username.



#### Members

* **Matthew Shvorin**
  * Worked on the Python Flask Backend (Connecting to webhook, processing data, emails, etc.)
* **Ian Clarke**
  * Created server folder and added "users" database in file database.sql. Added files db.ts and index.ts for creating, deleting, and editing users. Worked on Register.tsx file to ensure that server side API was being used correctly
* **Sabeet Hossain**
  * Designed initial skeleton for the react app including some basic frontend. helped with debugging when usernames weren't being added to the database correctly.
* **Kevin Wander**
  * implemented ticker subscription feature, helped collaborate with frontend people. Wrote the presentations. Worked on some frontend that ultimately wasn't used.

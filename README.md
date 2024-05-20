# Final Project Build Instructions



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


## Server Setup

Make sure you have Node.js installed before running the following commands.


To run the server, navigate to the “server” directory and follow these steps:

1. **Install ts-node**:
   - Ensure ts-node is installed:
     ```sh
     npm install -g ts-node
     ```
     Or if you prefer to install it locally:
     ```sh
     npm install ts-node --save-dev
     ```
   - Verify the installation:
     After installing ts-node, you can verify its installation by running:
     ```sh
     ts-node --version
     ```

2. **Install the 'cors' module**:
   ```sh
   npm install cors

Ensure that the types for 'cors' are available:
Sometimes TypeScript requires type declarations for modules. In this case, 'cors' might not have its own types, but you can install the types from DefinitelyTyped:
```sh
npm install @types/cors --save-dev
 ```

3.**Begin running the server**:
```sh
nodemon index.ts
 ```



## Client Setup

To run the client, navigate to the “frontend” directory and follow these steps:

1. **Install TypeScript as a development dependency**:
   ```sh
   npm install typescript --save-dev
```

2. **Begin running the client**:
     ```sh
     nodemon index.ts
     ```
 - Access the web application:
     Navigate to localhost:3000 in your web browser.

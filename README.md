# CSCI-499-Group-Project-MISK
the group project for CSCI 499. Our group members are Ian Clarke, Kevin Wander, Matthew Shvorin, and Sabeet Hossain

-you need to have node installed on your machine to run the web app
-dont push node modules to github


current instructions
-make sure you are in the directory CSCI-499-Group-Project-MISK <br />
cd frontend <br />
npm install <br />


for flask app <br/>
Make db called newsData <br/>
make tables called news_summary and users <br/>
CREATE TABLE users ( <br/>
    id SERIAL PRIMARY KEY, <br/>
    username VARCHAR(255) UNIQUE NOT NULL, <br/>
    password TEXT NOT NULL, <br/>
    email VARCHAR(255) UNIQUE NOT NULL, <br/>
    tickers TEXT[] <br/>
    ); <br/>
    CREATE TABLE news_summaries ( <br/>
    id SERIAL PRIMARY KEY, <br/>
     summary TEXT, <br/>
     tickers TEXT[], <br/>
     sentiment VARCHAR(10), <br/>
      level INTEGER <br/>
    ); <br/>
     CREATE DATABASE newsData; <br/>

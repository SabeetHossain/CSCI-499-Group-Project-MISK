CREATE DATABASE misk_info;



--ORIGINAL DATABASE--

-- CREATE TABLE users(
--     user_id SERIAL PRIMARY KEY,
--     -- description VARCHAR(255),
--     username VARCHAR(255),
--     tickers VARCHAR(255)
-- );


CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL, --formerly description
    password VARCHAR(255) NOT NULL DEFAULT '',
    email VARCHAR(255) UNIQUE,
    --role VARCHAR(50),
    tickers VARCHAR(255)
);

-- GOALS FOR THIS DATABASE:
-- create new columns to bring a more standard login experience for the app, add routes for editing 
-- these columns from the server side (test with postman). On the client side, make functions that allow
-- the user to create a username and password, register with an email, and potentially edit this information








-- to view all of the columns in the user table:

-- select *
-- from table_name
-- where false;

-- run this code after switching to the misk_info database




-- to add columns to database:
-- ALTER TABLE users
-- ADD COLUMN password VARCHAR(255) NOT NULL DEFAULT '',
-- ADD COLUMN email VARCHAR(255) UNIQUE;
-- ADD COLUMN tickers VARCHAR(255);
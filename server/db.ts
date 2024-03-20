// @ts-check


// import { Pool } from "pg";

// const pool = new Pool({
//     user: "postgres",
//     //Instructor, please replace the password variable with your own postgres password
//     password: "turtle1357",
//     host: "localhost",
//     port: 5432,
//     database: "misk_info"
// });

// export default pool;


import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export default pool;


//DATABASE_URL: postgres://u94q2hmdkutfig:p93efda47086cc7c59d40f6f5e8d471f74d8095429e6e641c008fecfc8b26b046@ceu9lmqblp8t3q.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/d7uuks355v9e6q
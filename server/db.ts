// @ts-check

// const Pool = require("pg").Pool;

// const pool = new Pool({
//     user: "postgres",
//     password: "turtle1357",
//     host: "localhost",
//     port: 5432,
//     database: "misk_info"
// });

// module.exports = pool;



import { Pool } from "pg";

const pool = new Pool({
    user: "postgres",
    password: "turtle1357",
    host: "localhost",
    port: 5432,
    database: "misk_info"
});

export default pool;

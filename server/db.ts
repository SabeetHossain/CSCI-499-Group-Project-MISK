// @ts-check


import { Pool } from "pg";

const pool = new Pool({
    user: "postgres",
    //Instructor, please replace the password variable with your own postgres password
    password: "pass",
    host: "localhost",
    port: 5432,
    database: "misk_info"
});

export default pool;
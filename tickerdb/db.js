//test files, not actually used in project

const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "post123",
    host: "localhost",
    port: 5432,
    database: "tickers"
});

module.exports = pool;
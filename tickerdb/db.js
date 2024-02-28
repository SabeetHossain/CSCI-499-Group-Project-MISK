const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "turtle1357",
    host: "localhost",
    port: 5432,
    database: "tickers"
});

module.exports = pool;
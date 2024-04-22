// @ts-check

import { Pool } from 'pg';

require('dotenv').config();

console.log(process.env.DATABASE_URL);

const pool = new Pool({
	ssl: {
		rejectUnauthorized: false,
	},
	connectionString: process.env.DATABASE_URL,
});

export default pool;

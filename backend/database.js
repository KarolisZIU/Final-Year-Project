import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();



export const pool = new pkg.Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});


// test
const res = await pool.query('SELECT NOW()');
console.log(res.rows);
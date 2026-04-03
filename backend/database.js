import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new pkg.Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

// test
async function testDB() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ DB connection successful:", res.rows);
  } catch (err) {
    console.error("❌ DB connection failed:", err);
  }
}

testDB(); // run the test when app starts

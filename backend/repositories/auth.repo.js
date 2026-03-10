import { pool } from "../database.js";

export async function findByUsername(username) {
  return pool.query(
    `SELECT staff_id, staff_name, staff_username, staff_password_hash, staff_role
     FROM staff WHERE staff_username = $1`,
    [username]
  );
}
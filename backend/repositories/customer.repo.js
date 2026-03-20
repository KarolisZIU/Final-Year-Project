import { pool } from "../database.js";

export async function getCustomerByEmail(email) {
  return pool.query(
    `SELECT customer_id FROM customers
     WHERE customer_email = $1`,
    [email]
  );
}

export async function createCustomer(name, email) {
  return pool.query(
    `INSERT INTO customers (customer_name, customer_email)
     VALUES ($1, $2)
     RETURNING customer_id`,
    [name, email]
  );
}
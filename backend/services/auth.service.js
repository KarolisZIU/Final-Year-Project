import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as authRepo from "../repositories/auth.repo.js";

export async function login(username, password) {
  const result = await authRepo.findByUsername(username);
  const user = result.rows[0];

  if (!user) throw new Error("Invalid Credentials");

  const match = await bcrypt.compare(password, user.staff_password_hash);
  if (!match) throw new Error("Invalid Credentials");

  const token = jwt.sign(
    { staffId: user.staff_id, role: user.staff_role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" },
  );

  return { token, role: user.staff_role, name: user.staff_name };
}

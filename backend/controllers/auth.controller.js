import * as authService from "../services/auth.service.js";

export async function login(req, res) {
  const { username, password } = req.body;
  try {
    const data = await authService.login(username, password);
    res.json(data);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}
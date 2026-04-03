import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { WebSocketServer } from "ws";

import servicesRoutes from "./routes/services.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";

// creates express app
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });
app.use(cors());
app.use(express.json());

// Routers
app.use("/api", servicesRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

//health check endpoint
app.get("/api/health", (req, res) =>
  res.json({ ok: true, message: "Backend is running" }),
);

// __dirname fix for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve Vue frontend
const frontendDist = path.join(__dirname, "../frontend/myapp/dist");
app.use(express.static(frontendDist));

// SPA fallback
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

export function broadcast(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`API + Frontend running on port ${PORT}`),
);

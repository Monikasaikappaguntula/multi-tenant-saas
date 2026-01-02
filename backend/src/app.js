import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import tenantUserRoutes from "./routes/tenantUserRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// 🔹 HEALTH CHECK (IMPORTANT)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", database: "connected" });
});

// 🔹 AUTH ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/tenants", tenantUserRoutes);
app.use("/api/projects", projectRoutes);

app.use("/api", taskRoutes);

export default app;

import express from "express";
import { login, registerTenant, getMe } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/register-tenant", registerTenant);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.post("/logout", authMiddleware, logout);
export default router;

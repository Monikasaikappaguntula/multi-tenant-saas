import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createProject } from "../controllers/projectController.js";
import {
  listProjects,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createProject
);
router.get("/", authMiddleware, listProjects);                    // API 13
router.put("/:projectId", authMiddleware, updateProject);        // API 14
router.delete("/:projectId", authMiddleware, deleteProject);     // API 15

export default router;

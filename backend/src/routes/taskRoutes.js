import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import 
{ 
  createTask,
  getProjectTasks,
  updateTaskStatus,
  deleteTask } from "../controllers/taskController.js";

const router = express.Router();

router.post(
  "/projects/:projectId/tasks",
  authMiddleware,
  createTask
);
router.get(
  "/projects/:projectId/tasks",
  authMiddleware,
  getProjectTasks
);
router.patch(
  "/tasks/:taskId/status",
  authMiddleware,
  updateTaskStatus
);
router.delete(
  "/tasks/:taskId",
  authMiddleware,
  deleteTask
);

export default router;

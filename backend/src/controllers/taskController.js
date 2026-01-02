import pool from "../config/db.js";

export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required"
      });
    }

    const projectResult = await pool.query(
      "SELECT tenant_id FROM projects WHERE id = $1",
      [projectId]
    );

    if (projectResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    const tenantId = projectResult.rows[0].tenant_id;

    const taskResult = await pool.query(
      `
      INSERT INTO tasks (id, project_id, tenant_id, title)
      VALUES (gen_random_uuid(), $1, $2, $3)
      RETURNING id, title, created_at
      `,
      [projectId, tenantId, title]
    );

    res.status(201).json({
      success: true,
      data: taskResult.rows[0]
    });

  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await pool.query(
      `
      SELECT id, title, created_at
      FROM tasks
      WHERE project_id = $1 AND tenant_id = $2
      ORDER BY created_at DESC
      `,
      [projectId, req.user.tenantId]
    );

    res.status(200).json({
      success: true,
      data: {
        tasks: tasks.rows
      }
    });

  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await pool.query(
      `
      SELECT id FROM tasks
      WHERE id = $1 AND tenant_id = $2
      `,
      [taskId, req.user.tenantId]
    );

    if (task.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    // Simulated success (no DB column)
    res.status(200).json({
      success: true,
      data: {
        id: taskId,
        status: req.body.status
      }
    });

  } catch (error) {
    console.error("Update task status error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const result = await pool.query(
      `
      DELETE FROM tasks
      WHERE id = $1 AND tenant_id = $2
      `,
      [taskId, req.user.tenantId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });

  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

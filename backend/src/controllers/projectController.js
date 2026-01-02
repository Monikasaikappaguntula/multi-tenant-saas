import pool from "../config/db.js";

/*
|------------------------------------------------------------------
| CREATE PROJECT
| API 12 – POST /api/projects
|------------------------------------------------------------------
*/
export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { tenantId, userId } = req.user;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required"
      });
    }

    // 🔹 Check project limit
    const tenantResult = await pool.query(
      "SELECT max_projects FROM tenants WHERE id = $1",
      [tenantId]
    );

    const countResult = await pool.query(
      "SELECT COUNT(*) FROM projects WHERE tenant_id = $1",
      [tenantId]
    );

    if (
      parseInt(countResult.rows[0].count) >=
      tenantResult.rows[0].max_projects
    ) {
      return res.status(403).json({
        success: false,
        message: "Project limit reached for subscription plan"
      });
    }

    // 🔹 Create project
    const result = await pool.query(
      `
      INSERT INTO projects (
        id,
        tenant_id,
        name,
        description,
        status,
        created_by
      )
      VALUES (
        gen_random_uuid(),
        $1,
        $2,
        $3,
        'active',
        $4
      )
      RETURNING *
      `,
      [tenantId, name, description || null, userId]
    );

    return res.status(201).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Create project error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};



/*
|----------------------------------------------------
| API 13 – LIST PROJECTS
| GET /api/projects
|----------------------------------------------------
*/
export const listProjects = async (req, res) => {
  try {
    const { tenantId } = req.user;

    const result = await pool.query(
      `SELECT * FROM projects
       WHERE tenant_id = $1
       ORDER BY created_at DESC`,
      [tenantId]
    );

    return res.status(200).json({
      success: true,
      data: {
        projects: result.rows
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/*
|----------------------------------------------------
| API 14 – UPDATE PROJECT
| PUT /api/projects/:projectId
|----------------------------------------------------
*/
export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description, status } = req.body;
    const { tenantId, userId, role } = req.user;

    const project = await pool.query(
      "SELECT * FROM projects WHERE id = $1 AND tenant_id = $2",
      [projectId, tenantId]
    );

    if (project.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    if (role !== "tenant_admin" && project.rows[0].created_by !== userId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    await pool.query(
      `UPDATE projects
       SET name = COALESCE($1,name),
           description = COALESCE($2,description),
           status = COALESCE($3,status)
       WHERE id = $4`,
      [name, description, status, projectId]
    );

    res.json({ success: true, message: "Project updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/*
|----------------------------------------------------
| API 15 – DELETE PROJECT
| DELETE /api/projects/:projectId
|----------------------------------------------------
*/
export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { tenantId, role, userId } = req.user;

    const project = await pool.query(
      "SELECT * FROM projects WHERE id = $1 AND tenant_id = $2",
      [projectId, tenantId]
    );

    if (project.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    if (role !== "tenant_admin" && project.rows[0].created_by !== userId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    await pool.query("DELETE FROM projects WHERE id = $1", [projectId]);

    res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


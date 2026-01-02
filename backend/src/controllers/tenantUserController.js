import pool from "../config/db.js";
import bcrypt from "bcrypt";

/*
|--------------------------------------------------------------------------
| CREATE TENANT USER
|--------------------------------------------------------------------------
| API 8 – POST /api/tenants/:tenantId/users
*/
export const createTenantUser = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { email, password, fullName, role = "user" } = req.body;

    // Only tenant_admin allowed
    if (req.user.role !== "tenant_admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    // Tenant isolation
    if (req.user.tenantId !== tenantId) {
      return res.status(403).json({
        success: false,
        message: "Cross-tenant access denied"
      });
    }

    // Validate input
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Check tenant exists
    const tenantResult = await pool.query(
      "SELECT id, max_users FROM tenants WHERE id = $1",
      [tenantId]
    );

    if (tenantResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found"
      });
    }

    // Check subscription user limit
    const countResult = await pool.query(
      "SELECT COUNT(*) FROM users WHERE tenant_id = $1",
      [tenantId]
    );

    if (parseInt(countResult.rows[0].count) >= tenantResult.rows[0].max_users) {
      return res.status(403).json({
        success: false,
        message: "User limit reached for subscription plan"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userResult = await pool.query(
      `
      INSERT INTO users (
        id,
        tenant_id,
        email,
        password_hash,
        full_name,
        role,
        is_active
      )
      VALUES (
        gen_random_uuid(),
        $1,
        LOWER($2),
        $3,
        $4,
        $5,
        true
      )
      RETURNING id, email, full_name, role
      `,
      [tenantId, email, hashedPassword, fullName, role]
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: userResult.rows[0]
    });

  } catch (error) {
    console.error("Create user error:", error);

    // Duplicate email per tenant
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists in this tenant"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/*
|--------------------------------------------------------------------------
| LIST TENANT USERS
|--------------------------------------------------------------------------
| API 9 – GET /api/tenants/:tenantId/users
*/
export const getTenantUsers = async (req, res) => {
  try {
    const { tenantId } = req.params;

    // Auth check
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // Only tenant_admin allowed
    if (req.user.role !== "tenant_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    // Tenant isolation
    if (req.user.tenantId !== tenantId) {
      return res.status(403).json({
        success: false,
        message: "Cross-tenant access denied"
      });
    }

    const usersResult = await pool.query(
      `
      SELECT
        id,
        email,
        full_name,
        role,
        is_active,
        created_at
      FROM users
      WHERE tenant_id = $1
      ORDER BY created_at DESC
      `,
      [tenantId]
    );

    return res.status(200).json({
      success: true,
      data: {
        users: usersResult.rows
      }
    });

  } catch (error) {
    console.error("List users error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE USER
|--------------------------------------------------------------------------
| API 10 – PUT /api/users/:userId
*/
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, is_active } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // Only tenant_admin allowed
    if (req.user.role !== "tenant_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    // Prevent admin updating self
    if (req.user.userId === userId) {
      return res.status(403).json({
        success: false,
        message: "You cannot update your own account"
      });
    }

    // Get target user
    const userResult = await pool.query(
      "SELECT id, tenant_id FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Tenant isolation
    if (userResult.rows[0].tenant_id !== req.user.tenantId) {
      return res.status(403).json({
        success: false,
        message: "Cross-tenant access denied"
      });
    }

    await pool.query(
      `
      UPDATE users
      SET
        role = COALESCE($1, role),
        is_active = COALESCE($2, is_active)
      WHERE id = $3
      `,
      [role, is_active, userId]
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully"
    });

  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


/*
|---------------------------------------------------------------------------
| DELETE USER
|---------------------------------------------------------------------------
| API 11 – DELETE /api/tenants/users/:userId
*/
export const deleteTenantUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;

    if (currentUser.role !== "tenant_admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    if (currentUser.userId === userId) {
      return res.status(403).json({
        success: false,
        message: "Cannot delete yourself"
      });
    }

    const userResult = await pool.query(
      "SELECT id, tenant_id FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (userResult.rows[0].tenant_id !== currentUser.tenantId) {
      return res.status(403).json({
        success: false,
        message: "Cross-tenant access denied"
      });
    }

    await pool.query(
      "DELETE FROM users WHERE id = $1",
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

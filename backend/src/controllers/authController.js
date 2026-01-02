import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

/*
|--------------------------------------------------------------------------
| REGISTER TENANT
|--------------------------------------------------------------------------
*/
export const registerTenant = async (req, res) => {
  const { tenantName, subdomain, adminEmail, adminPassword, adminFullName } = req.body;

  try {
    const exists = await pool.query(
      "SELECT id FROM tenants WHERE subdomain = $1",
      [subdomain]
    );

    if (exists.rowCount > 0) {
      return res.status(409).json({
        success: false,
        message: "Subdomain exists"
      });
    }

    const tenantId = uuid();
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    await pool.query("BEGIN");

    await pool.query(
      `INSERT INTO tenants (id, name, subdomain)
       VALUES ($1, $2, $3)`,
      [tenantId, tenantName, subdomain]
    );

    await pool.query(
      `INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4, $5, 'tenant_admin')`,
      [uuid(), tenantId, adminEmail.toLowerCase(), passwordHash, adminFullName]
    );

    await pool.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Tenant registered successfully"
    });

  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/
export const login = async (req, res) => {
  const { email, password, tenantSubdomain } = req.body;

  try {
    const tenantRes = await pool.query(
      "SELECT id FROM tenants WHERE subdomain = $1",
      [tenantSubdomain]
    );

    if (tenantRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found"
      });
    }

    const tenantId = tenantRes.rows[0].id;

    const userRes = await pool.query(
      "SELECT * FROM users WHERE LOWER(email) = $1 AND tenant_id = $2",
      [email.toLowerCase(), tenantId]
    );

    if (userRes.rowCount === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const user = userRes.rows[0];

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { userId: user.id, tenantId, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          tenantId
        },
        token
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET CURRENT USER
|--------------------------------------------------------------------------
*/
export const getMe = async (req, res) => {
  try {
    const { userId, tenantId, role } = req.user;

    const userResult = await pool.query(
      `SELECT id, email, full_name, role, is_active
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    let tenant = null;

    if (role !== "super_admin") {
      const tenantResult = await pool.query(
        `SELECT id, name, subdomain, subscription_plan, max_users, max_projects
         FROM tenants
         WHERE id = $1`,
        [tenantId]
      );
      tenant = tenantResult.rows[0];
    }

    res.json({
      success: true,
      data: {
        id: userResult.rows[0].id,
        email: userResult.rows[0].email,
        fullName: userResult.rows[0].full_name,
        role: userResult.rows[0].role,
        isActive: userResult.rows[0].is_active,
        tenant
      }
    });

  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const logout = async (req, res) => {
  try {
    // JWT is stateless – client removes token
    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

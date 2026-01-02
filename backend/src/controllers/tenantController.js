import pool from "../config/db.js";

/*
|--------------------------------------------------------------------------
| UPDATE TENANT
|--------------------------------------------------------------------------
| API 6 – PUT /api/tenants/:tenantId
*/
export const updateTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { name } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (req.user.role !== "tenant_admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    if (req.user.tenantId !== tenantId) {
      return res.status(403).json({
        success: false,
        message: "Cross-tenant access denied"
      });
    }

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Tenant name is required"
      });
    }

    await pool.query(
      "UPDATE tenants SET name = $1 WHERE id = $2",
      [name.trim(), tenantId]
    );

    return res.status(200).json({
      success: true,
      message: "Tenant updated successfully"
    });

  } catch (error) {
    console.error("Update tenant error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
/*
|--------------------------------------------------------------------------
| LIST ALL TENANTS (SUPER ADMIN)
|--------------------------------------------------------------------------
| API 7 – GET /api/tenants
*/
export const listTenants = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const tenantsResult = await pool.query(
      `
      SELECT
        t.id,
        t.name,
        t.subdomain,
        t.subscription_plan,
        COUNT(DISTINCT u.id) AS total_users,
        COUNT(DISTINCT p.id) AS total_projects
      FROM tenants t
      LEFT JOIN users u ON u.tenant_id = t.id
      LEFT JOIN projects p ON p.tenant_id = t.id
      GROUP BY t.id
      ORDER BY t.created_at DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );

    const countResult = await pool.query(
      "SELECT COUNT(*) FROM tenants"
    );

    const totalTenants = parseInt(countResult.rows[0].count);

    res.status(200).json({
      success: true,
      data: {
        tenants: tenantsResult.rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalTenants / limit),
          totalTenants
        }
      }
    });

  } catch (error) {
    console.error("List tenants error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

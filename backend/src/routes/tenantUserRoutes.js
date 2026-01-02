import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import tenantIsolation from "../middleware/tenantIsolation.js";
import { createTenantUser,getTenantUsers } from "../controllers/tenantUserController.js";
import { updateTenant } from "../controllers/tenantController.js";
import { listTenants } from "../controllers/tenantController.js";
import { updateUser } from "../controllers/tenantUserController.js";
import { deleteTenantUser } from "../controllers/tenantUserController.js";


const router = express.Router();

router.post(
  "/:tenantId/users",
  authMiddleware,
  tenantIsolation,
  createTenantUser
);
router.put("/:tenantId/update",
   authMiddleware,
    updateTenant
  );
router.get(
  "/",
  authMiddleware,
  listTenants
);
router.get(
  "/:tenantId/users",
  authMiddleware,
  tenantIsolation,
  getTenantUsers
);


router.put(
  "/users/:userId",
  authMiddleware,
  updateUser
);
router.delete(
  "/users/:userId",
  authMiddleware,
  deleteTenantUser
);
export default router;

const tenantIsolation = (req, res, next) => {
  // Super admin can access everything
  if (req.user.role === "super_admin") {
    return next();
  }

  // Attach tenantId from token
  if (!req.user.tenantId) {
    return res.status(403).json({
      success: false,
      message: "Tenant access denied"
    });
  }

  req.tenantId = req.user.tenantId;
  next();
};

export default tenantIsolation;

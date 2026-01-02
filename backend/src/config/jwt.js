import jwt from "jsonwebtoken";

export const generateToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || "dev-secret-key-1234567890",
    { expiresIn: "24h" }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET || "dev-secret-key-1234567890"
  );
};

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const roleMiddleware = async (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: "Access Denied",
        });
      }
      next();
    } catch (error) {
      return res.status(403).json({
        message: "Access Denied",
      });
    }
  };
};

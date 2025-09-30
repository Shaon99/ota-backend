const AuthService = require("../services/authService");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access token required" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    let decoded;
    try {
      decoded = AuthService.verifyToken(token);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" });
      }
      return res.status(401).json({ error: "Invalid token" });
    }

    // Validate token payload
    if (!decoded || typeof decoded.adminId !== "number") {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    // Find admin and verify active status
    const admin = await AuthService.findAdminById(decoded.adminId);

    if (!admin || !admin.isActive) {
      return res.status(401).json({ error: "Invalid or inactive admin account" });
    }

    // Attach admin info to request object
    req.admin = {
      id: admin.id,
      email: admin.email,
      role: admin.role
    };

    return next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ error: "Authentication failed" });
  }
};

module.exports = authMiddleware;

const AuthService = require("../services/authService");
const B2BService = require("../services/b2bService");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false,
        error: "Access token required",
        message: "Please provide a valid Bearer token"
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    let decoded;
    try {
      decoded = AuthService.verifyToken(token);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ 
          success: false,
          error: "Token expired",
          message: "Please login again"
        });
      }
      return res.status(401).json({ 
        success: false,
        error: "Invalid token",
        message: "Please provide a valid token"
      });
    }

    // Validate token payload
    if (!decoded || (!decoded.adminId && !decoded.id)) {
      return res.status(401).json({ 
        success: false,
        error: "Invalid token payload",
        message: "Token does not contain valid user information"
      });
    }

    // Check if it's an admin token
    if (decoded.adminId) {
      // Admin authentication
      const admin = await AuthService.findAdminById(decoded.adminId);

      if (!admin || !admin.isActive) {
        return res.status(401).json({ 
          success: false,
          error: "Invalid or inactive admin account",
          message: "Admin account not found or deactivated"
        });
      }

      // Attach admin info to request object
      req.user = {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        type: 'admin'
      };
      req.admin = req.user; // Keep backward compatibility

    } else if (decoded.id) {
      // B2B Customer authentication
      const customer = await B2BService.findB2BCustomerById(decoded.id);

      if (!customer || !customer.isActive) {
        return res.status(401).json({ 
          success: false,
          error: "Invalid or inactive customer account",
          message: "Customer account not found or deactivated"
        });
      }

      // Check if customer is deleted
      if (customer.deletedAt) {
        return res.status(401).json({ 
          success: false,
          error: "Account not found",
          message: "Customer account has been deleted"
        });
      }

      // Attach customer info to request object
      req.user = {
        id: customer.id,
        email: customer.email,
        role: customer.role,
        type: 'b2b_customer'
      };
      req.customer = req.user; // For B2B customer specific routes

    } else {
      return res.status(401).json({ 
        success: false,
        error: "Invalid token format",
        message: "Token does not contain valid user identification"
      });
    }

    return next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ 
      success: false,
      error: "Authentication failed",
      message: "Unable to authenticate user"
    });
  }
};

// Admin-only middleware
const adminAuthMiddleware = async (req, res, next) => {
  try {
    await authMiddleware(req, res, () => {
      if (req.user.type !== 'admin') {
        return res.status(403).json({
          success: false,
          error: "Access denied",
          message: "Admin access required"
        });
      }
      next();
    });
  } catch (error) {
    console.error("Admin auth middleware error:", error);
    return res.status(401).json({ 
      success: false,
      error: "Authentication failed",
      message: "Unable to authenticate admin"
    });
  }
};

// B2B Customer-only middleware
const b2bAuthMiddleware = async (req, res, next) => {
  try {
    await authMiddleware(req, res, () => {
      if (req.user.type !== 'b2b_customer') {
        return res.status(403).json({
          success: false,
          error: "Access denied",
          message: "B2B customer access required"
        });
      }
      next();
    });
  } catch (error) {
    console.error("B2B auth middleware error:", error);
    return res.status(401).json({ 
      success: false,
      error: "Authentication failed",
      message: "Unable to authenticate B2B customer"
    });
  }
};

module.exports = {
  authMiddleware,
  adminAuthMiddleware,
  b2bAuthMiddleware
};
const AuthService = require("../services/authService");
const { adminSignInValidation } = require("../middlewares/validation");
const ResponseUtil = require("../utils/response");

// Admin Sign In
const adminSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await AuthService.authenticateAdmin(email, password);
    
    // Generate response
    const response = AuthService.generateAuthResponse(admin);
    
    return ResponseUtil.success(res, response, 'Login successful');
  } catch (error) {    
    if (error.message === 'Invalid credentials' || error.message === 'Account is deactivated') {
      return ResponseUtil.unauthorized(res, error.message);
    }
    
    return ResponseUtil.error(res, "Internal server error");
  }
};

// Admin Logout (client-side token removal)
const adminLogout = async (req, res) => {
  try {    
    return ResponseUtil.success(res, null, 'Logout successful');
  } catch (error) {
    return ResponseUtil.error(res, "Internal server error");
  }
};

// Get current admin profile
const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.admin.id;

    const admin = await AuthService.findAdminById(adminId);

    if (!admin) {
      return ResponseUtil.notFound(res, "Admin not found");
    }

    return ResponseUtil.success(res, { admin }, 'Profile retrieved successfully');
  } catch (error) {
    Logger.error("Get admin profile error:", { error: error.message, adminId: req.admin?.id });
    return ResponseUtil.error(res, "Internal server error");
  }
};

module.exports = { 
  adminSignIn,
  adminSignInValidation,
  adminLogout, 
  getAdminProfile 
};
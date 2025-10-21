const express = require("express");
const router = express.Router();

// Controllers imports
const { 
  adminSignIn,
  adminLogout, 
  getAdminProfile 
} = require("../../controllers/authController");

const { 
  registerB2BCustomer,
  signInB2BCustomer
} = require("../../controllers/b2bCustomerController");

// Middleware imports
const { adminAuthMiddleware } = require("../../middlewares/authMiddleware");
const { 
  adminSignInValidation,
  b2bCustomerCreateValidation,
  b2bCustomerSignInValidation
} = require("../../middlewares/validation");

// Admin Authentication Routes
router.post("/admin/signin", adminSignInValidation, adminSignIn);
router.post("/admin/logout", adminAuthMiddleware, adminLogout);
router.get("/admin/profile", adminAuthMiddleware, getAdminProfile);

// B2B Customer Authentication Routes
router.post("/b2b/register", b2bCustomerCreateValidation, registerB2BCustomer);
router.post("/b2b/signin", b2bCustomerSignInValidation, signInB2BCustomer);

module.exports = router;

const express = require("express");
const router = express.Router();

// Controllers imports
const { 
  adminSignIn,
  adminSignInValidation, 
  adminLogout, 
  getAdminProfile 
} = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");


// Admin Authentication Routes
router.post("/admin/signin", adminSignInValidation, adminSignIn);
router.post("/admin/logout", authMiddleware, adminLogout);
router.get("/admin/profile", authMiddleware, getAdminProfile);

module.exports = router;

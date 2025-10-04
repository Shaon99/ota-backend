const express = require("express");
const router = express.Router();

// Controllers imports
const { 
  getB2BCustomerById,
  updateB2BCustomer,
  updateB2BCustomerPassword
} = require("../../controllers/b2bCustomerController");

// Middleware imports
const { b2bAuthMiddleware } = require("../../middlewares/authMiddleware");
const { 
  b2bCustomerProfileUpdateValidation,
  b2bCustomerPasswordChangeValidation
} = require("../../middlewares/validation");

// B2B Customer Self-Service Routes (for logged-in B2B customers)
router.get("/profile", b2bAuthMiddleware, getB2BCustomerById);
router.put("/profile", b2bAuthMiddleware, b2bCustomerProfileUpdateValidation, updateB2BCustomer);
router.put("/password", b2bAuthMiddleware, b2bCustomerPasswordChangeValidation, updateB2BCustomerPassword);

module.exports = router;

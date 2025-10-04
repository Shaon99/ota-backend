const express = require("express");
const router = express.Router();

// Controllers imports
const { 
  createB2BCustomer,
  getAllB2BCustomers,
  getB2BCustomerById,
  updateB2BCustomer,
  updateB2BCustomerPassword,
  updateB2BCustomerStatus,
  deleteB2BCustomer
} = require("../../controllers/b2bCustomerController");

// Middleware imports
const { adminAuthMiddleware } = require("../../middlewares/authMiddleware");
const { 
  b2bCustomerCreateValidation,
  b2bCustomerProfileUpdateValidation,
  b2bCustomerPasswordChangeValidation,
  b2bCustomerStatusUpdateValidation
} = require("../../middlewares/validation");

// Admin B2B Customer Management Routes
router.post("/b2b/customer", adminAuthMiddleware, b2bCustomerCreateValidation, createB2BCustomer);
router.get("/b2b/customers", adminAuthMiddleware, getAllB2BCustomers);
router.get("/b2b/customer/:id", adminAuthMiddleware, getB2BCustomerById);
router.put("/b2b/customer/:id", adminAuthMiddleware, b2bCustomerProfileUpdateValidation, updateB2BCustomer);
router.put("/b2b/customer/:id/password", adminAuthMiddleware, b2bCustomerPasswordChangeValidation, updateB2BCustomerPassword);
router.put("/b2b/customer/:id/status", adminAuthMiddleware, b2bCustomerStatusUpdateValidation, updateB2BCustomerStatus);
router.delete("/b2b/customer/:id", adminAuthMiddleware, deleteB2BCustomer);

module.exports = router;

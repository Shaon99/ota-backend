const B2BService = require("../services/b2bService");
const ResponseUtil = require("../utils/response");

// Create B2B customer
const createB2BCustomer = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      isActive,
      city,
      thana,
      address,
      c_name,
      business_email,
      c_phone_number,
      c_email,
      trade_license,
      civil_aviation_certificate,
      national_id_front,
      national_id_back,
      address_proof,
      heard_about,
    } = req.body;
    const b2bCustomer = await B2BService.createB2BCustomer({
      name,
      email,
      phone,
      isActive,
      password,
      city,
      thana,
      address,
      c_name,
      business_email,
      c_phone_number,
      c_email,
      trade_license,
      civil_aviation_certificate,
      national_id_front,
      national_id_back,
      address_proof,
      heard_about,
    });
    return ResponseUtil.success(
      res,
      b2bCustomer,
      "B2B customer created successfully"
    );
  } catch (error) {
    return ResponseUtil.error(res, error.message || "Internal server error");
  }
};

// Get all B2B customers
const getAllB2BCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const result = await B2BService.getAllB2BCustomers(
      parseInt(page),
      parseInt(limit),
      search
    );
    return ResponseUtil.success(
      res,
      result,
      "B2B customers fetched successfully"
    );
  } catch (error) {
    return ResponseUtil.error(res, error.message || "Internal server error");
  }
};

// Get B2B customer by ID
const getB2BCustomerById = async (req, res) => {
  try {
    // If called from B2B self-service route, use the authenticated user's ID
    // If called from admin route, use the ID from params
    const id =
      req.user.type === "b2b_customer" ? req.user.id : parseInt(req.params.id);
    const b2bCustomer = await B2BService.getB2BCustomerById(id);
    return ResponseUtil.success(
      res,
      b2bCustomer,
      "B2B customer fetched successfully"
    );
  } catch (error) {
    return ResponseUtil.error(res, error.message || "Internal server error");
  }
};

// Update B2B customer
const updateB2BCustomer = async (req, res) => {
  try {
    // If called from B2B self-service route, use the authenticated user's ID
    // If called from admin route, use the ID from params
    const id =
      req.user.type === "b2b_customer" ? req.user.id : parseInt(req.params.id);
    const updateData = req.body;
    const b2bCustomer = await B2BService.updateB2BCustomer(id, updateData);
    return ResponseUtil.success(
      res,
      b2bCustomer,
      "B2B customer updated successfully"
    );
  } catch (error) {
    return ResponseUtil.error(res, error.message || "Internal server error");
  }
};

// Update B2B customer password
const updateB2BCustomerPassword = async (req, res) => {
  try {
    const id =
      req.user.type === "b2b_customer" ? req.user.id : parseInt(req.params.id);
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return ResponseUtil.error(
        res,
        "New password and confirm password do not match"
      );
    }

    const result = await B2BService.updateB2BCustomerPassword(
      id,
      currentPassword,
      newPassword
    );
    return ResponseUtil.success(res, result, "Password updated successfully");
  } catch (error) {
    return ResponseUtil.error(res, error.message || "Internal server error");
  }
};

// Update B2B customer status
const updateB2BCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const b2bCustomer = await B2BService.updateB2BCustomerStatus(
      parseInt(id),
      isActive
    );
    return ResponseUtil.success(
      res,
      b2bCustomer,
      "B2B customer status updated successfully"
    );
  } catch (error) {
    return ResponseUtil.error(res, error.message || "Internal server error");
  }
};

// Delete B2B customer
const deleteB2BCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await B2BService.deleteB2BCustomer(parseInt(id));
    return ResponseUtil.success(
      res,
      result,
      "B2B customer deleted successfully"
    );
  } catch (error) {
    return ResponseUtil.error(res, error.message || "Internal server error");
  }
};

// B2B customer registration
const registerB2BCustomer = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      isActive,
      city,
      thana,
      address,
      c_name,
      business_email,
      c_phone_number,
      c_email,
      trade_license,
      civil_aviation_certificate,
      national_id_front,
      national_id_back,
      address_proof,
      heard_about,
    } = req.body;

    const customer = await B2BService.createB2BCustomer({
      name,
      email,
      phone,
      password,
      isActive,
      city,
      thana,
      address,
      c_name,
      business_email,
      c_phone_number,
      c_email,
      trade_license,
      civil_aviation_certificate,
      national_id_front,
      national_id_back,
      address_proof,
      heard_about,
    });

    const authResponse = B2BService.generateAuthResponse(customer);
    return ResponseUtil.success(
      res,
      authResponse,
      "B2B customer registered successfully"
    );
  } catch (error) {
    // Handle specific error types with appropriate status codes
    if (error.message.includes("already exists")) {
      return ResponseUtil.conflict(res, error.message);
    }
    if (error.message.includes("cannot be an empty object")) {
      return ResponseUtil.validationError(res, error.message);
    }
    return ResponseUtil.error(res, error.message || "Internal server error");
  }
};

// B2B customer signin
const signInB2BCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await B2BService.authenticateB2BCustomer(email, password);
    const authResponse = B2BService.generateAuthResponse(customer);
    return ResponseUtil.success(res, authResponse, "B2B Login successful");
  } catch (error) {
    // Handle authentication errors with appropriate status codes
    if (
      error.message === "Invalid credentials" ||
      error.message === "Account is deactivated" ||
      error.message === "Account not found"
    ) {
      return ResponseUtil.unauthorized(res, error.message);
    }
    return ResponseUtil.error(res, error.message || "Internal server error");
  }
};

module.exports = {
  createB2BCustomer,
  getAllB2BCustomers,
  getB2BCustomerById,
  updateB2BCustomer,
  updateB2BCustomerPassword,
  updateB2BCustomerStatus,
  deleteB2BCustomer,
  registerB2BCustomer,
  signInB2BCustomer,
};

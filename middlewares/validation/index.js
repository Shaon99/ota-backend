
// Auth validations
const {
  adminSignInValidation,
  adminProfileUpdateValidation,
  adminPasswordChangeValidation
} = require('./authValidation');

// B2B Customer validations
const {
  b2bCustomerCreateValidation,
  b2bCustomerRegistrationValidation,
  b2bCustomerSignInValidation,
  b2bCustomerProfileUpdateValidation,
  b2bCustomerPasswordChangeValidation,
  b2bCustomerStatusUpdateValidation,
} = require("./b2bCustomerValidation");

module.exports = {
  // Auth validations
  adminSignInValidation,
  adminProfileUpdateValidation,
  adminPasswordChangeValidation,

  // B2B Customer validations
  b2bCustomerCreateValidation,
  b2bCustomerRegistrationValidation,
  b2bCustomerSignInValidation,
  b2bCustomerProfileUpdateValidation,
  b2bCustomerPasswordChangeValidation,
  b2bCustomerStatusUpdateValidation,
};

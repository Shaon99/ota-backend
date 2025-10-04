/**
 * Validate email format
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  return true;
};

/**
 * Validate password strength
 */
const validatePassword = (password) => {
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
  return true;
};

/**
 * Validate Bangladeshi phone number format
 * Accepts formats: +8801XXXXXXXXX, 8801XXXXXXXXX, 01XXXXXXXXX
 */
const validatePhone = (phone) => {
  // Remove spaces, dashes, parentheses
  const normalized = phone ? phone.replace(/[\s\-\(\)]/g, '') : '';
  // Bangladeshi phone number regex
  // Accepts: +8801XXXXXXXXX, 8801XXXXXXXXX, 01XXXXXXXXX
  const bdPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
  if (!normalized || !bdPhoneRegex.test(normalized)) {
    throw new Error('Invalid Bangladeshi phone number format');
  }
  return true;
};

/**
 * Sanitize input data
 */
const sanitizeInput = (data) => {
  const sanitized = {};
  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'string') {
      sanitized[key] = data[key].trim();
    } else {
      sanitized[key] = data[key];
    }
  });
  return sanitized;
};

/**
 * Validation middleware factory
 */
const createValidationMiddleware = (validationRules) => {
  return (req, res, next) => {
    try {
      // Sanitize input
      req.body = sanitizeInput(req.body);

      // Apply validation rules
      Object.entries(validationRules).forEach(([field, rules]) => {
        const value = req.body[field];
        
        if (rules.required && !value) {
          throw new Error(`${field} is required`);
        }
        
        if (value) {
          if (rules.type === 'email') {
            validateEmail(value);
          } else if (rules.type === 'password') {
            validatePassword(value);
          } else if (rules.type === 'phone') {
            validatePhone(value);
          }
          
          if (rules.minLength && value.length < rules.minLength) {
            throw new Error(`${field} must be at least ${rules.minLength} characters long`);
          }
          
          if (rules.maxLength && value.length > rules.maxLength) {
            throw new Error(`${field} must be no more than ${rules.maxLength} characters long`);
          }
        }
      });

      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: error.message
      });
    }
  };
};

/**
 * B2B Customer creation validation
 */
const b2bCustomerCreateValidation = createValidationMiddleware({
  name: { 
    required: true, 
    type: 'string',
    minLength: 2,
    maxLength: 100
  },
  email: { 
    required: true, 
    type: 'email',
    maxLength: 255
  },
  phone: { 
    required: true, 
    type: 'phone',
    minLength: 10,
    maxLength: 20
  },
  password: { 
    required: true, 
    type: 'password', 
    minLength: 6,
    maxLength: 128
  }
});

/**
 * B2B Customer signin validation
 */
const b2bCustomerSignInValidation = createValidationMiddleware({
  email: { 
    required: true, 
    type: 'email',
    maxLength: 255
  },
  password: { 
    required: true, 
    type: 'password', 
    minLength: 6,
    maxLength: 128
  }
});

/**
 * B2B Customer profile update validation
 */
const b2bCustomerProfileUpdateValidation = createValidationMiddleware({
  name: { 
    required: false, 
    type: 'string',
    minLength: 2,
    maxLength: 100
  },
  email: { 
    required: false, 
    type: 'email',
    maxLength: 255
  },
  phone: { 
    required: false, 
    type: 'phone',
    minLength: 10,
    maxLength: 20
  }
});

/**
 * B2B Customer password change validation
 */
const b2bCustomerPasswordChangeValidation = createValidationMiddleware({
  currentPassword: { 
    required: true, 
    type: 'password',
    minLength: 6,
    maxLength: 128
  },
  newPassword: { 
    required: true, 
    type: 'password', 
    minLength: 8,
    maxLength: 128
  },
  confirmPassword: { 
    required: true, 
    type: 'password', 
    minLength: 8,
    maxLength: 128
  }
});

/**
 * B2B Customer status update validation
 */
const b2bCustomerStatusUpdateValidation = createValidationMiddleware({
  isActive: { 
    required: true, 
    type: 'boolean'
  }
});

module.exports = {
  b2bCustomerCreateValidation,
  b2bCustomerSignInValidation,
  b2bCustomerProfileUpdateValidation,
  b2bCustomerPasswordChangeValidation,
  b2bCustomerStatusUpdateValidation
};

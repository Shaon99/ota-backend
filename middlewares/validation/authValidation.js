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
 * Admin signin validation
 */
const adminSignInValidation = createValidationMiddleware({
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
 * Admin profile update validation
 */
const adminProfileUpdateValidation = createValidationMiddleware({
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
  }
});

/**
 * Admin password change validation
 */
const adminPasswordChangeValidation = createValidationMiddleware({
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

module.exports = {
  adminSignInValidation,
  adminProfileUpdateValidation,
  adminPasswordChangeValidation
};
// Route constants for better organization and maintainability

const ROUTES = {
  // API versions
  V1: '/api/v1',
  
  // Route prefixes
  AUTH: '/auth',
  ADMIN: '/admin',
  B2B: '/b2b',
  
  // Admin routes
  ADMIN_SIGNIN: '/admin/signin',
  ADMIN_LOGOUT: '/admin/logout',
  ADMIN_PROFILE: '/admin/profile',
  
  // B2B customer management routes (admin)
  ADMIN_B2B_CUSTOMER: '/b2b/customer',
  ADMIN_B2B_CUSTOMERS: '/b2b/customers',
  ADMIN_B2B_CUSTOMER_BY_ID: '/b2b/customer/:id',
  ADMIN_B2B_CUSTOMER_PASSWORD: '/b2b/customer/:id/password',
  ADMIN_B2B_CUSTOMER_STATUS: '/b2b/customer/:id/status',
  
  // B2B customer authentication routes
  B2B_REGISTER: '/b2b/register',
  B2B_SIGNIN: '/b2b/signin',
  
  // B2B customer self-service routes
  B2B_PROFILE: '/profile',
  B2B_PASSWORD: '/password',
  
  // System routes
  HEALTH: '/health'
};

const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
};

module.exports = {
  ROUTES,
  HTTP_METHODS
};

# Routes Structure

This directory contains the organized route structure for the OTA Backend API.

## Directory Structure

```
routes/
├── index.js                 # Main route entry point
├── routeConfig.js          # Route configuration and registration
├── modules/                # Modular route files
│   ├── authRoutes.js       # Authentication routes
│   ├── adminRoutes.js      # Admin management routes
│   └── b2bRoutes.js        # B2B customer self-service routes
└── README.md               # This documentation
```

## Route Modules

### 1. Authentication Routes (`/api/v1/auth`)
- `POST /admin/signin` - Admin login
- `POST /admin/logout` - Admin logout
- `GET /admin/profile` - Get admin profile
- `POST /b2b/register` - B2B customer registration (public)
- `POST /b2b/signin` - B2B customer login

### 2. Admin Routes (`/api/v1/admin`)
- `POST /b2b/customer` - Create B2B customer
- `GET /b2b/customers` - Get all B2B customers
- `GET /b2b/customer/:id` - Get B2B customer by ID
- `PUT /b2b/customer/:id` - Update B2B customer
- `PUT /b2b/customer/:id/password` - Update B2B customer password
- `PUT /b2b/customer/:id/status` - Update B2B customer status
- `DELETE /b2b/customer/:id` - Delete B2B customer

### 3. B2B Customer Routes (`/api/v1/b2b`)
- `GET /profile` - Get own profile
- `PUT /profile` - Update own profile
- `PUT /password` - Change own password

## API Endpoints

### Health Check
- `GET /health` - API health status

### Error Handling
- `*` - 404 handler for undefined routes

## Adding New Routes

1. Create a new route file in `modules/` directory
2. Import the route in `routeConfig.js`
3. Add the route configuration to the `routeConfig` array
4. Update this README with the new routes

## Route Organization Benefits

- **Modularity**: Each module handles specific functionality
- **Maintainability**: Easy to find and modify specific routes
- **Scalability**: Easy to add new modules without cluttering
- **Separation of Concerns**: Clear separation between different user types
- **Version Control**: Easy to track changes in specific modules

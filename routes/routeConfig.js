const express = require("express");

// Import route modules
const authRoutes = require("./modules/authRoutes");
const adminRoutes = require("./modules/adminRoutes");
const b2bRoutes = require("./modules/b2bRoutes");

// Create main router
const router = express.Router();

// Route configurations
const routeConfig = [
  {
    path: "/api/v1",
    routes: [
      { path: "/auth", router: authRoutes },
      { path: "/admin", router: adminRoutes },
      { path: "/b2b", router: b2bRoutes }
    ]
  }
];

// Register all routes
routeConfig.forEach(config => {
  config.routes.forEach(route => {
    router.use(config.path + route.path, route.router);
  });
});

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "OTA Backend API is operational.",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// 404 handler for undefined routes
router.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "The requested resource could not be found on this server.",
    path: req.originalUrl,
    method: req.method
  });
});

module.exports = router;

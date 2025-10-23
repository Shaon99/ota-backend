require('dotenv').config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const routes = require("./routes");
const database = require("./config/database");

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: "Too many requests from this IP, please try again later." }
}));

// CORS
app.use(cors());

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "OTA Backend API",
    version: "1.0.0",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use(routes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);
  
  if (res.headersSent) {
    return next(err);
  }
  
  res.status(500).json({ 
    success: false,
    error: "Internal server error",
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Server startup
(async () => {
  try {
    await database.connect();
    
    const server = app.listen(PORT, () => {
      console.log(`🚀 OTA Backend API listening on port ${PORT}!`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/v1/health`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      try {
        console.log("Shutting down gracefully...");
        server.close(() => {
          console.log("Server closed");
        });
        await database.disconnect();
        process.exit(0);
      } catch (error) {
        console.error("Error during shutdown:", error.message);
        process.exit(1);
      }
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
    
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
})();
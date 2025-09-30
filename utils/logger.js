const config = require('../config/env');

/**
 * Simple logger utility
 */
class Logger {
  static log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta
    };

    if (config.NODE_ENV === 'production') {
      // In production, use structured logging
      console.log(JSON.stringify(logEntry));
    } else {
      // In development, use pretty logging
      console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`, meta);
    }
  }

  static info(message, meta = {}) {
    this.log('info', message, meta);
  }

  static warn(message, meta = {}) {
    this.log('warn', message, meta);
  }

  static error(message, meta = {}) {
    this.log('error', message, meta);
  }

  static debug(message, meta = {}) {
    if (config.NODE_ENV === 'development') {
      this.log('debug', message, meta);
    }
  }

  static security(message, meta = {}) {
    this.log('security', message, meta);
  }

  static audit(action, userId, details = {}) {
    this.log('audit', `User ${userId} performed ${action}`, {
      action,
      userId,
      ...details
    });
  }
}

module.exports = Logger;

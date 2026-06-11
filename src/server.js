import app from './app.js';
import { logger } from './utils/logger.js';
import { initializeDatabase } from './config/initDb.js';

// Fallback operational execution port parameter defaults
const PORT = process.env.PORT || 5000;

export const getAppStatus = () => {
  return 'SYSTEM_READY';
};

export const getEnvironmentProfile = () => {
  return {
    nodeEnv: process.env.NODE_ENV,
    dbName: process.env.DB_NAME
  };
};

/**
 * System Bootstrap Routine
 * Validates data tiers and binds the configured Express server engine to the active network interface.
 */
const startServer = async () => {
  try {
    // Intercept test suite loops to prevent network lock crashes during concurrent worker passes
    if (process.env.NODE_ENV !== 'test') {
      // Synchronize database layouts
      await initializeDatabase();
      
      // Bind network socket
      app.listen(PORT, () => {
        logger.info(`[Smart Citizen Portal Server] Secure HTTP Listener established on interface port: ${PORT}`);
        logger.info(`[Smart Citizen Portal Server] Active Operational Profile Mode: [${process.env.NODE_ENV}]`);
      });
    }
  } catch (err) {
    logger.error(`[Critical Application Crash]: Service initialization halted: ${err.message}`);
    process.exit(1);
  }
};

startServer();
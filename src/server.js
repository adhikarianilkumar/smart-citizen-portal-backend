import { logger } from './utils/logger.js';
import { initializeDatabase } from './config/initDb.js';

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
 * Ensures infrastructure definitions are established before the service actively processes data.
 */
const startServer = async () => {
  try {
    // Prevent server execution collision errors during automated test runner passes
    if (process.env.NODE_ENV !== 'test') {
      await initializeDatabase();
      logger.info(`[Smart Citizen Portal Engine] Active and securely booted in [${process.env.NODE_ENV}] mode.`);
    }
  } catch (err) {
    logger.error(`[Critical Application Crash]: Service initialization halted: ${err.message}`);
    process.exit(1);
  }
};

startServer();
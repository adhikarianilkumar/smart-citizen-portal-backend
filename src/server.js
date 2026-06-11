import { logger } from './utils/logger.js';

export const getAppStatus = () => {
  return 'SYSTEM_READY';
};

export const getEnvironmentProfile = () => {
  return {
    nodeEnv: process.env.NODE_ENV,
    dbName: process.env.DB_NAME
  };
};

// Replaced raw console.log with our structured enterprise logger
logger.info(`[System] Initialization module loaded natively in [${process.env.NODE_ENV}] mode.`);
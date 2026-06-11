/**
 * Dummy execution verification module.
 * This proves our ESM exports and Jest integration are functioning natively.
 */
export const getAppStatus = () => {
  return 'SYSTEM_READY';
};

/**
 * Reads directly from the natively injected process.env boundary.
 */
export const getEnvironmentProfile = () => {
  return {
    nodeEnv: process.env.NODE_ENV,
    dbName: process.env.DB_NAME
  };
};

console.log(`[System] Initialization module loaded via ESM natively in [${process.env.NODE_ENV}] mode.`);
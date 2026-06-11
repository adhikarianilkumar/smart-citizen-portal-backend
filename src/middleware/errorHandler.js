import { logger } from '../utils/logger.js';

/**
 * ARCHITECTURAL DESIGN NOTE: Global Exception Interceptor
 * Captures all unhandled runtime exceptions across the routing fabric.
 * Sanitizes outbound JSON payloads to prevent structural info-leakage vectors.
 */
export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isDevelopmentOrTest = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

  // Systematically capture structural diagnostic logs via Winston
  logger.error(`[Unhandled Exception] [${req.method}] ${req.originalUrl} - Error: ${err.message}`, {
    stack: err.stack,
    ip: req.ip
  });

  // Emit clean, hardened response structures
  res.status(statusCode).json({
    status: 'fail',
    error: statusCode === 500 ? 'InternalServerError' : err.name || 'ApplicationError',
    message: statusCode === 500 ? 'A secure internal processing anomaly occurred.' : err.message,
    // Disclose diagnostic stack frames ONLY in safe local inspection execution environments
    ...(isDevelopmentOrTest && { debug_stack: err.stack })
  });
};
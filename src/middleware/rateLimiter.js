import rateLimit from 'express-rate-limit';
import { logger } from '../utils/logger.js';

/**
 * ARCHITECTURAL SECURITY NOTE: Rate Limiting Guardrail
 * Enforces a strict maximum request threshold per unique IP address window.
 * Dynamically logs boundary violations for operational visibility and SIEM ingestion.
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes inspection window
  max: 100, // Limit each client IP to 100 requests per window
  standardHeaders: true, // Return standard rate limit info headers (RateLimit-Limit, etc.)
  legacyHeaders: false, // Disable X-RateLimit-* legacy headers
  message: {
    status: 429,
    error: 'Too Many Requests',
    message: 'Security baseline threshold exceeded. Request velocity throttled.'
  },
  handler: (req, res, next, options) => {
    // Log violation to telemetry system for audit review
    logger.warn(`[Security Alert] Rate limit threshold breached by client IP: ${req.ip} on route: ${req.originalUrl}`);
    res.status(options.statusCode).send(options.message);
  }
});
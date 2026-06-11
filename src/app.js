import express from 'express';
import helmet from 'helmet';
import { corsConfig } from './middleware/corsConfig.js';
import { globalRateLimiter } from './middleware/rateLimiter.js';
import { globalErrorHandler } from './middleware/errorHandler.js';
import { healthRoutes } from './routes/health.routes.js';

// Instantiate the foundational Express web interface engine
const app = express();

// --- ZERO-TRUST MIDDLEWARE BOUNDARIES ---

// Apply Helmet to automatically assign HTTP security headers (X-Frame-Options, CSP, HSTS, etc.)
app.use(helmet());

// Apply our decoupled Cross-Origin Resource Sharing (CORS) security boundary
app.use(corsConfig);

// Apply raw request payload body parsers capped at maximum size boundaries to prevent memory fatigue
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Apply the global security threshold rate limiter across all ingress routes
app.use(globalRateLimiter);

// --- ROUTE ATTACHMENTS ---
app.use('/api/v1/health', healthRoutes);

/**
 * Fallback Route Interceptor for invalid endpoints (404 Handler)
 * NOTE: Omitting the path parameter entirely is the modern, strict-mode compliant 
 * method for catching all unhandled requests without triggering path-to-regexp errors.
 */
app.use((req, res, next) => {
  const error = new Error(`The requested physical resource path [${req.originalUrl}] does not exist.`);
  error.statusCode = 404;
  error.name = 'NotFoundError';
  next(error); // Push directly down into the global error handler chain
});

// Register the centralized polymorphic error processing layer as the absolute final catch block
app.use(globalErrorHandler);

export default app;
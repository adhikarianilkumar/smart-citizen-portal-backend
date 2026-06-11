import cors from 'cors';

/**
 * ARCHITECTURAL DESIGN NOTE: Modular CORS Configuration
 * Extracts Cross-Origin Resource Sharing rules from the main application 
 * orchestrator, keeping network boundary configurations isolated, testable, 
 * and easy to scale across multiple microservices.
 */
export const corsConfig = cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
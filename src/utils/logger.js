import winston from 'winston';

const currentEnv = process.env.NODE_ENV || 'development';

// Define enterprise log level severity thresholds
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Set dynamic visibility thresholds depending on environment scope
const level = () => {
  return currentEnv === 'development' || currentEnv === 'test' ? 'debug' : 'info';
};

// Log color formatting configuration for human-readable terminal consumption
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Strategy 1: Human-readable colorized terminal formatting for local execution
const localFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `[${info.timestamp}] [${info.level}]: ${info.message}`
  )
);

// Strategy 2: Structured JSON serialization for cloud log aggregators (QA / PROD)
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Instantiate the polymorphic logger instance
export const logger = winston.createLogger({
  level: level(),
  levels,
  format: currentEnv === 'development' || currentEnv === 'test' ? localFormat : productionFormat,
  transports: [
    new winston.transports.Console()
  ],
});
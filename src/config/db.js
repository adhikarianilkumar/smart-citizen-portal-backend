// src/config/db.js
import pg from 'pg';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger.js';

/**
 * InMemoryPostgresSimulator
 * Provides a clean slate in-memory database simulator for deterministic isolated testing.
 */
class InMemoryPostgresSimulator {
  constructor() {
    this.tables = { users: [], claims: [], security_audit_logs: [] };
  }

  async query(text, params) {
    logger.debug(`[DB Simulator] Executing Query: "${text.substring(0, 50)}..."`);
    return { rows: [] }; // Base mock return for testing phase
  }

  insertMockUser(rawUserObject) {
    this.tables.users.push({
      id: rawUserObject.id,
      email: rawUserObject.email,
      password_hash: bcrypt.hashSync(rawUserObject.password, 12),
      role: rawUserObject.role || 'citizen'
    });
    logger.debug(`[DB Simulator] Injected user: ${rawUserObject.email}`);
  }
}

// --- POLYMORPHIC INFRASTRUCTURE SELECTION FACTORY ---
const selectedDatabaseMode = process.env.DATABASE_MODE || 'memory';
let instantiatedPoolInstance;

if (selectedDatabaseMode === 'postgres') {
  logger.info(`[Database Provider] Target: QA/PROD. Connecting to live PostgreSQL cluster...`);
  
  instantiatedPoolInstance = new pg.Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 20,                       
    idleTimeoutMillis: 30000,      
    connectionTimeoutMillis: 2000  
  });

  instantiatedPoolInstance.on('error', (err) => {
    logger.error(`[Critical Telemetry Alert]: Unhandled database client failure: ${err.message}`);
  });

} else {
  logger.info(`[Database Provider] Target: LOCAL/CI. Booting In-Memory Database Simulator.`);
  instantiatedPoolInstance = new InMemoryPostgresSimulator();
}

export const pool = instantiatedPoolInstance;
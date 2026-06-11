import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './db.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initializeDatabase = async () => {
  const schemaPath = path.join(__dirname, 'schema.sql');
  
  try {
    logger.info(`[DB Init] Reading schema profile from target disk location...`);
    const sqlScript = fs.readFileSync(schemaPath, 'utf8');
    
    logger.info(`[DB Init] Applying structural components to target cluster...`);
    await pool.query(sqlScript);
    
    logger.info(`[DB Init] All foundational tables and optimization metrics applied successfully.`);
  } catch (error) {
    logger.error(`[Fatal Infrastructure Failure]: Database layout instantiation aborted: ${error.message}`);
    throw error;
  }
};
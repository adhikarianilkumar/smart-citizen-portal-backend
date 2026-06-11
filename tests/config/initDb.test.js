// tests/config/initDb.test.js
import { jest } from '@jest/globals';

/**
 * ARCHITECTURAL DESIGN NOTE: Native ESM Module Isolation
 * Using jest.unstable_mockModule prevents the Jest compiler from attempting 
 * to inject legacy CommonJS require() hooks into our native ES Module sandbox.
 */
jest.unstable_mockModule('fs', () => ({
  default: {
    readFileSync: jest.fn()
  }
}));

jest.unstable_mockModule('../../src/config/db.js', () => ({
  pool: {
    query: jest.fn()
  }
}));

jest.unstable_mockModule('../../src/utils/logger.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

// Resolve modules dynamically after the mock boundaries are locked into the VM context
const fs = await import('fs');
const { pool } = await import('../../src/config/db.js');
const { initializeDatabase } = await import('../../src/config/initDb.js');

describe('Database Bootstrap Automator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should read the schema file and execute it against the database pool', async () => {
    // Arrange
    fs.default.readFileSync.mockReturnValue('CREATE TABLE mock_table();');
    pool.query.mockResolvedValue({ rows: [] });

    // Act
    await initializeDatabase();

    // Assert
    expect(fs.default.readFileSync).toHaveBeenCalled();
    expect(pool.query).toHaveBeenCalledWith('CREATE TABLE mock_table();');
  });
});
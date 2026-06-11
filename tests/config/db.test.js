import { pool } from '../../src/config/db.js';

describe('Enterprise Database Connection Pooling Engine', () => {
  it('should instantiate a valid database pool interface with a query method', () => {
    // Assert
    expect(pool).toBeDefined();
    expect(typeof pool.query).toBe('function');
  });

  it('should expose the insertMockUser utility when running in memory mode', () => {
    // Act & Assert
    // Since our test environment natively defaults to 'memory' mode, the simulator should be active
    expect(typeof pool.insertMockUser).toBe('function');
  });
});
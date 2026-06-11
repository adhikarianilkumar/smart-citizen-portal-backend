// tests/server.test.js
import { getAppStatus } from '../server.js';

describe('System Initialization and ESM Verification', () => {
  it('should successfully load ES modules and return a healthy initialization status', () => {
    // Act
    const status = getAppStatus();
    
    // Assert
    expect(status).toBe('SYSTEM_READY');
  });
});
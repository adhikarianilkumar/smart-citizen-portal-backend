// tests/server.test.js
import { getAppStatus, getEnvironmentProfile } from '../src/server.js';

describe('System Initialization and ESM Verification', () => {
  it('should successfully load ES modules and return a healthy initialization status', () => {
    const status = getAppStatus();
    expect(status).toBe('SYSTEM_READY');
  });

  it('should natively load the isolated test environment variables via --env-file', () => {
    // Act
    const envProfile = getEnvironmentProfile();
    
    // Assert
    expect(envProfile.nodeEnv).toBe('test');
    expect(envProfile.dbName).toBe('citizen_portal_test');
  });
});
import { logger } from '../../src/utils/logger.js';

describe('Centralized Telemetry and Logging Engine', () => {
  it('should instantiate a valid logger interface with standard transport methods', () => {
    // Assert
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });

  it('should dynamically set the log level to "debug" when running in the test environment', () => {
    // Act
    const currentLevel = logger.level;
    
    // Assert
    expect(currentLevel).toBe('debug');
  });
});
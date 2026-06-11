import { jest } from '@jest/globals';
import request from 'supertest';

/**
 * ARCHITECTURAL DESIGN NOTE: Native ESM Test Orchestration
 * Mock external layers dynamically prior to loading the application module context.
 */
jest.unstable_mockModule('../../src/config/db.js', () => ({
  pool: { query: jest.fn() }
}));

// Dynamically resolve our app layout inside our secure mock context container
const { default: app } = await import('../../src/app.js');

describe('Security Framework & Base Route Architecture Integration Matrix', () => {
  
  it('should hit the health telemetry route and return a valid 200 JSON payload structure', async () => {
    // Act
    const response = await request(app)
      .get('/api/v1/health')
      .expect('Content-Type', /json/)
      .expect(200);

    // Assert
    expect(response.body).toHaveProperty('status', 'UP');
    expect(response.body).toHaveProperty('environment', 'test');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('should intercept unknown execution route vectors with a standardized 404 payload structures', async () => {
    // Act
    const response = await request(app)
      .get('/api/v1/invalid-and-malicious-route-attempt')
      .expect('Content-Type', /json/)
      .expect(404);

    // Assert
    expect(response.body.status).toBe('fail');
    expect(response.body.error).toBe('NotFoundError');
    expect(response.body.message).toContain('does not exist');
  });
});
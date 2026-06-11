// tests/jest.setup.js
import fs from 'fs';
import path from 'path';

/**
 * ARCHITECTURAL DESIGN NOTE: Native Sandbox Environment Injector
 * Bypasses Jest's VM isolation by explicitly loading and parsing the .env.test 
 * file directly into the active test execution thread without third-party dependencies.
 */
const envPath = path.resolve(process.cwd(), '.env.test');

if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  
  envConfig.split('\n').forEach((line) => {
    const splitIndex = line.indexOf('=');
    if (splitIndex > -1) {
      const key = line.substring(0, splitIndex).trim();
      // Safely strip Windows carriage returns (\r) and whitespace
      const value = line.substring(splitIndex + 1).trim().replace(/\r/g, ''); 
      
      // Inject directly into the Jest process runtime
      process.env[key] = value;
    }
  });
} else {
  console.warn('[Test Sandbox] CRITICAL WARNING: .env.test file not found at project root.');
}
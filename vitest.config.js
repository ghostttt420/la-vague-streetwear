/**
 * LA VAGUE - Vitest Configuration
 * Unit testing configuration for the e-commerce platform
 */

import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    // Test environment
    environment: 'jsdom',
    
    // Test file patterns
    include: ['tests/unit/**/*.test.js'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['*.js', 'src/**/*.js'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        '*.config.js',
        'scripts/',
        'server.js',
        'checkout-api.js'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80
      }
    },
    
    // Global test setup
    globals: true,
    
    // Setup files to run before tests
    setupFiles: ['./tests/helpers/test-setup.js'],
    
    // Mock configuration
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
    
    // Reporter configuration
    reporters: ['verbose'],
    
    // Timeout for tests
    testTimeout: 10000,
    hookTimeout: 10000
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@tests': resolve(__dirname, 'tests')
    }
  }
});

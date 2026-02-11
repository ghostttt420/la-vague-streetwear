#!/usr/bin/env node
/**
 * LA VAGUE - Husky Setup Script
 * Conditionally installs husky hooks (skips in CI/Render)
 */

import { execSync } from 'child_process';

// Skip if in CI or Render environment
if (process.env.CI || process.env.RENDER) {
    console.log('Skipping husky setup in CI/Render environment');
    process.exit(0);
}

try {
    execSync('husky', { stdio: 'inherit' });
    console.log('Husky hooks installed successfully');
} catch (error) {
    console.warn('Failed to install husky hooks:', error.message);
    process.exit(0); // Don't fail the install
}

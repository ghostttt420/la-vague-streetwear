/**
 * LA VAGUE - ESLint Configuration
 * Code quality and consistency rules
 */

import globals from 'globals';
import js from '@eslint/js';

export default [
  // Base ESLint recommended rules
  js.configs.recommended,
  
  // Global configuration
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        // Define global variables used in the project
        'PRODUCTS': 'readonly',
        'CATEGORIES': 'readonly',
        'SIZE_GUIDES': 'readonly',
        'ProductAPI': 'readonly',
        'CartState': 'readonly',
        'LaVagueAPI': 'readonly',
        'LoadingManager': 'readonly',
        'Toast': 'readonly',
        'Validator': 'readonly',
      },
    },
    
    rules: {
      // Error Prevention
      'no-unused-vars': ['warn', { 
        'vars': 'all', 
        'args': 'after-used',
        'ignoreRestSiblings': true 
      }],
      'no-undef': 'error',
      'no-console': 'off', // Allow console for now (e-commerce debugging)
      'no-debugger': 'warn',
      
      // Best Practices
      'eqeqeq': ['error', 'always', { 'null': 'ignore' }],
      'curly': ['error', 'multi-line'],
      'no-var': 'warn',
      'prefer-const': 'warn',
      'no-throw-literal': 'error',
      'no-return-await': 'error',
      'require-await': 'off',
      
      // Code Style
      'indent': ['error', 4, { 
        'SwitchCase': 1,
        'ignoredNodes': ['TemplateLiteral *']
      }],
      'quotes': ['error', 'single', { 
        'avoidEscape': true,
        'allowTemplateLiterals': true 
      }],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'space-before-function-paren': ['error', {
        'anonymous': 'always',
        'named': 'never',
        'asyncArrow': 'always'
      }],
      'keyword-spacing': 'error',
      'space-infix-ops': 'error',
      'eol-last': 'error',
      'no-trailing-spaces': 'error',
      'max-len': ['warn', { 
        'code': 120,
        'ignoreUrls': true,
        'ignoreStrings': true,
        'ignoreTemplateLiterals': true
      }],
      
      // ES6+ Features
      'arrow-spacing': 'error',
      'arrow-parens': ['error', 'as-needed'],
      'prefer-arrow-callback': 'warn',
      'prefer-template': 'warn',
      'template-curly-spacing': 'error',
      'rest-spread-spacing': 'error',
      
      // Node.js / Backend specific
      'no-process-exit': 'off',
    },
  },
  
  // Backend server specific rules
  {
    files: ['server.js', 'checkout-api.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off', // Server needs logging
    },
  },
  
  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'database.sqlite',
      '*.min.js',
      '.git/**',
    ],
  },
];

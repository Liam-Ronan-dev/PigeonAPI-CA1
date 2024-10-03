import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import jest from 'eslint-plugin-jest';

export default [
  js.configs.recommended,

  {
    ignores: ['node_modules/**'],
  },

  // Configuration for source files
  {
    files: ['**/*.js'],
    ignores: ['**/__tests__/**', '**/*.test.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettier.rules,
      'prettier/prettier': 'error',
      'no-unused-vars': 'warn',
      'no-console': 'warn',
    },
  },

  // Configuration for test files
  {
    files: ['**/__tests__/**/*.js', '**/*.test.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      prettier: prettierPlugin,
      jest,
    },
    rules: {
      ...prettier.rules,
      'prettier/prettier': 'error',
      ...jest.configs.recommended.rules,
    },
  },
];

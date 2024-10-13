import globals from 'globals';
import pluginJs from '@eslint/js';
import prettier from 'eslint-config-prettier'; // Prettier config to disable ESLint rules that conflict with Prettier
import eslintPluginPrettier from 'eslint-plugin-prettier'; // Plugin to run Prettier as an ESLint rule
import pluginJest from 'eslint-plugin-jest'; // Jest plugin for linting

export default [
  // Node.js globals and environment
  {
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 2021, // Use ECMAScript 2021 features
    },
  },

  // ESLint core recommended settings
  pluginJs.configs.recommended,

  // Jest plugin to support testing in the codebase
  {
    plugins: {
      jest: pluginJest,
    },
    rules: {
      ...pluginJest.configs.recommended.rules,
    },
  },

  // Prettier plugin to integrate with ESLint
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error', // Marks prettier issues as ESLint errors
    },
  },

  // Prettier configuration to avoid conflicts with ESLint rules
  prettier,
];

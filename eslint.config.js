import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/.next/**', '**/.turbo/**'],
  },
  {
    files: ['**/*.{js,cjs,mjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // TypeScript already checks this; ESLint's no-undef does not understand TS types (e.g. RequestInit).
      'no-undef': 'off',
      // Use the TS-aware rule instead (handles parameter properties, types, etc.).
      'no-unused-vars': 'off',
      ...reactHooksPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Monorepo boundary enforcement (lightweight, eslint-core only):
      // - public SDK must not import from private apps
      // - packages should not reach into apps
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['apps/*', '../../apps/*', '../../../apps/*', '../../../../apps/*'],
              message: 'Do not import from apps/* (deployables) into packages; use shared contracts/packages instead.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['apps/web/**/*.{ts,tsx}', 'apps/verify/**/*.{ts,tsx}', 'packages/client/**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['apps/api/**/*.ts', 'apps/gateway/**/*.ts'],
    languageOptions: {
      globals: globals.node,
    },
  },
];



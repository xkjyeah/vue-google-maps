/* eslint-env node */
// import mmr from '@rushstack/eslint-patch/modern-module-resolution';
import esLintJs from '@eslint/js';
import configVuePrettier from '@vue/eslint-config-prettier';
import configVueTS from '@vue/eslint-config-typescript';
import pluginCypress from 'eslint-plugin-cypress/flat';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

const resultConfig = tsEslint.config(
  // Global ignored files
  {
    ignores: [
      '.pack/*',
      'dist/*',
      'coverage/*',
      'cypress/runner/dist/*',
      'cypress/runner/vite.config.mts',
      'cypress/runner/runner.cjs',
      'vite.config.ts',
      'vitest.config.ts',
      'eslint.config.mjs',
    ],
  },

  // Base configuration for all JavaScript files
  esLintJs.configs.recommended,
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2024,
        google: true,
        globalThis: true,
      },
    },
  },

  // TypeScript configuration with type checking
  ...tsEslint.configs.recommendedTypeChecked,
  ...tsEslint.configs.strictTypeChecked,
  ...tsEslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parser: tsEslint.parser,
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { ignoreRestSiblings: true },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/no-namespace': [
        'error',
        { allowDeclarations: true, allowDefinitionFiles: true },
      ],
    },
  },

  // Vue specific configurations with Prettier integration
  ...pluginVue.configs['flat/strongly-recommended'],
  ...configVueTS(),
  configVuePrettier,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.vue'],
      },
    },
  },
  {
    files: ['*.vue', '**/*.vue'],
    rules: {
      'vue/block-lang': [
        'error',
        {
          script: {
            lang: ['ts', 'js'],
          },
        },
      ],
    },
  },

  // Cypress testing configurations
  pluginCypress.configs.recommended,
  pluginCypress.configs.globals,
  {
    files: ['cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}'],
    plugins: {
      pluginCypress,
    },
  },
);

export default resultConfig;

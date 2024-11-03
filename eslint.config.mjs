import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    rules: {
      'indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      '@typescript-eslint/no-namespace': 'off',
      'no-mixed-spaces-and-tabs': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },},
  {languageOptions: { globals: globals.node }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
      jsx: true,
    },
    tsconfigRootDir: __dirname,
    // have a single tsconfig for type-aware eslint rules to prevent OOMs
    // see https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/MONOREPO.md#important-note-regarding-large--10-multi-package-monorepos
    project: ['./tsconfig.eslint.json'],
  },
  plugins: [
    'react',
    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin
    '@typescript-eslint',
    // https://github.com/benmosher/eslint-plugin-import
    'import',
    // https://www.npmjs.com/package/eslint-plugin-react-hooks
    'react-hooks',
    // https://github.com/jest-community/eslint-plugin-jest
    'jest',
  ],
  rules: {
    'jsx-quotes': 'error',
    'import/no-extraneous-dependencies': 'error',
    'no-var': 'error',
    'no-unused-expressions': 'error',
    'object-shorthand': 'error',
    'spaced-comment': 'error',
    'no-irregular-whitespace': 'error',
    'react-hooks/rules-of-hooks': 'error',
    // 'react-hooks/exhaustive-deps': 'warn',
    // TODO: follow-up
    // '@typescript-eslint/no-duplicate-imports': 'error',
    // eqeqeq: ['error', 'always', { null: 'ignore' }],
    // 'import/order': ['error', { alphabetize: { order: 'asc' } }],
    // 'no-console': ['error', { allow: ['warn', 'error'] }],
  },
  overrides: [
    {
      files: ['src/{components,hooks}/**/*.{ts,tsx}'],
      rules: {
        // note: short circuits often report false negatives (https://github.com/typescript-eslint/typescript-eslint/issues/2128)
        '@typescript-eslint/no-unnecessary-condition': 'warn',
      },
    },
  ],
  settings: {
    react: {
      createClass: 'createReactClass', // Regex for Component Factory to use,
      pragma: 'React', // Pragma to use, default to "React"
      fragment: 'Fragment', // Fragment to use (may be a property of <pragma>), default to "Fragment"
      version: 'detect', // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      // It will default to "latest" and warn if missing, and to "detect" in the future
      flowVersion: '0.53', // Flow version
    },
  },
};

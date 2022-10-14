module.exports = {
  root   : true,
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: [
    '@typescript-eslint',
    'react',
  ],
  parser       : '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion : 2022,
    sourceType  : 'module',
    project     : './tsconfig.json',
  },
  rules: {
    'max-len'                     : ['error', 140],
    'import/no-unresolved'        : 0,
    'react/jsx-filename-extension': [1, {
      extensions: ['.ts', '.tsx'],
    }],
    'no-use-before-define'        : 'off',
    'import/extensions'           : ['error', 'never'],
    'react/prop-types'            : 0,
    'no-shadow'                   : 'off',
    '@typescript-eslint/no-shadow': ['error'],

    // CUSTOM
    'global-require'              : 'off',
    'import/prefer-default-export': 'off',
    'comma-dangle'                : ['error', {
      arrays   : 'always-multiline',
      objects  : 'always-multiline',
      imports  : 'never',
      exports  : 'never',
      functions: 'never',
    }],
    'key-spacing': ['error', {
      singleLine: {
        beforeColon: false,
        afterColon : true,
      },
      multiLine: { align: 'colon' },
    }],
    curly                             : ['error', 'multi-or-nest', 'consistent'],
    'no-underscore-dangle'            : 0,
    'no-console'                      : process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger'                     : process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'nonblock-statement-body-position': ['error', 'any'],
    'object-curly-newline'            : ['error', {
      ObjectExpression : { minProperties: 10, multiline: true, consistent: true },
      ObjectPattern    : { minProperties: 10, multiline: true, consistent: true },
      ImportDeclaration: { minProperties: 10, multiline: true, consistent: true },
      ExportDeclaration: { minProperties: 10, multiline: true, consistent: true },
    }],

    // REACT
    'react/require-default-props'      : 'off',
    'react/react-in-jsx-scope'         : 'off',
    'react/style-prop-object'          : 'off',
    'react/jsx-props-no-spreading'     : 'off',
    'react/jsx-curly-spacing'          : [2, 'always'],
    '@typescript-eslint/no-unused-vars': 'error',
  },
};

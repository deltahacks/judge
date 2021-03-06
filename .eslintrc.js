module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: ["plugin:vue/essential", "@vue/prettier"],

  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    'max-len': 'off',
    'no-unused-vars': 'off',
    'no-unused-labels': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'linebreak-style': 0
  },

  parserOptions: {
    parser: '@typescript-eslint/parser'
  },

  overrides: [
    {
      files: ["**/__tests__/*.{j,t}s?(x)"],
      env: {
        jest: true
      }
    }
  ],

  'extends': [
    'plugin:vue/essential',
    '@vue/prettier',
    '@vue/typescript'
  ]
};

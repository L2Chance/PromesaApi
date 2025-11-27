module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "quotes": ["off"],
    "indent": ["off"],
    "object-curly-spacing": ["off"],
    "max-len": ["off"],
    "require-jsdoc": ["off"],
    "comma-dangle": ["off"],
    "arrow-parens": ["off"],
    "no-unused-vars": ["warn"],
    "eol-last": ["off"],
    "valid-jsdoc": ["off"]
  },
  parserOptions: {
    ecmaVersion: 2022,
  },
};

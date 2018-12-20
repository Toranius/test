module.exports = {
  env: {
    es6: true,
    node: true,
    mocha: true
  },
  plugins: ["prettier"],
  extends: ["eslint:recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    "prettier/prettier": "error",
  }
};

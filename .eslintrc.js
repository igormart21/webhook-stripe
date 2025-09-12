module.exports = {
  extends: [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/jsx-runtime",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-hooks", "react-refresh"],
  rules: {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-empty-object-type": "warn",
    "@typescript-eslint/no-require-imports": "warn",
    "react-refresh/only-export-components": "warn",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
};

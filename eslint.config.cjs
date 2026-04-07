// eslint.config.cjs

const eslint = require("@eslint/js");

const ts = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");

module.exports = [
  // ESLint core recommended rules (safe)
  eslint.configs.recommended,

  {
    files: ["**/*.{js,jsx,ts,tsx}"],

    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
      },
    },

    settings: {
    },

    plugins: {
      "@typescript-eslint": ts,
    },

    rules: {
      // Turn off the core rule in favour of the TS-aware one
      "no-unused-vars": "off",
      // Ignore undefined because Typescript will already find them and eslint doesn't know Typescript built-in types
      "no-undef": "off",

      // TypeScript rules (manually enabled)
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
];
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "react/prop-types": "off",
      // Treat unused variables as warnings and ignore names starting with '_'
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { "varsIgnorePattern": "^_", "argsIgnorePattern": "^_", "caughtErrorsIgnorePattern": "^_" }
      ],
      // Disable base rule to avoid duplicate reports
      "no-unused-vars": "off",
    },
  },
  {
    files: ["src/api/**", "src/types/**/*.d.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-control-regex": "off",
      "no-useless-escape": "off",
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": "off",
    },
  },
]);
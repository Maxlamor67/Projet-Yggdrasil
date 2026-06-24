"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_1 = require("@eslint/js");
const globals_1 = require("globals");
const typescript_eslint_1 = require("typescript-eslint");
const config_1 = require("eslint/config");
exports.default = (0, config_1.defineConfig)([
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        plugins: { js: js_1.default },
        extends: ["js/recommended"],
        languageOptions: { globals: globals_1.default.browser },
        ignores: [
            "src/generated/**"
        ]
    },
    typescript_eslint_1.default.configs.recommended,
    {
        files: ["**/*.{ts,tsx}"],
        rules: {
            "react/react-in-jsx-scope": "off",
            "react/no-unescaped-entities": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "react/prop-types": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { "varsIgnorePattern": "^_", "argsIgnorePattern": "^_", "caughtErrorsIgnorePattern": "^_" }
            ],
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
    {
        files: ["src/generated/**"],
        rules: {
            "@typescript-eslint/no-namespace": "off"
        }
    }
]);
//# sourceMappingURL=eslint.config.js.map
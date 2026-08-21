import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactRefresh from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
    {
        ignores: ["node_modules/**", "dist/**", "coverage/**", ".vite/**"],
    },

    js.configs.recommended,

    ...tseslint.configs.recommendedTypeChecked,

    {
        files: ["src/**/*.{ts,tsx}"],

        languageOptions: {
            globals: {
                ...globals.browser,
            },

            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },

        plugins: {
            react,
            "react-hooks": reactHooks,
            "jsx-a11y": jsxA11y,
            "react-refresh": reactRefresh,
            import: importPlugin,
        },

        settings: {
            react: {
                version: "detect",
            },

            "import/resolver": {
                typescript: true,
            },
        },

        rules: {
            "@typescript-eslint/no-explicit-any": "warn",

            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],

            "@typescript-eslint/consistent-type-imports": [
                "error",
                {
                    prefer: "type-imports",
                    fixStyle: "separate-type-imports",
                },
            ],

            // React
            ...react.configs.recommended.rules,

            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",

            ...reactHooks.configs.recommended.rules,

            ...jsxA11y.configs.recommended.rules,

            "react-refresh/only-export-components": [
                "warn",
                {
                    allowConstantExport: true,
                },
            ],

            "import/no-duplicates": "error",
            "import/no-unresolved": "error",
            "import/no-named-as-default": "off",
        },
    },

    {
        files: ["vite.config.ts"],

        languageOptions: {
            globals: {
                ...globals.node,
            },

            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },

    eslintConfigPrettier,
);

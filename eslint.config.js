import tsParser from "@typescript-eslint/parser";
import svelteParser from "svelte-eslint-parser";
import tseslint from "typescript-eslint";

export default [
  ...tseslint.configs.recommended,
  {
    ignores: ["**/.svelte-kit/*"],
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
      },
    },
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-wrapper-object-types": "off",
    },
  },
  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-wrapper-object-types": "off",
    },
  },
];

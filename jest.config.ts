import type { Config } from "jest";

export default {
  preset: "jest-puppeteer",
  globals: {
    URL: "http://localhost:5173",
  },
  testMatch: ["**/tests/**/*.test.ts"],
  testPathIgnorePatterns: ["/node_modules/"],
  testTimeout: 8000,
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
} as Config;

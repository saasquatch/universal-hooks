import type { Config } from "@jest/types";

const esModules = ["haunted", "lit-html"].join("|");

const config: Config.InitialOptions = {
  testMatch: ["**/test/main.ts"],
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "ts-jest",
  },
  transformIgnorePatterns: [`node_modules/(?!(${esModules}))`],
  globals: {
    "ts-jest": {
      tsconfig: "test/tsconfig.json"
    }
  }
};

export default config;

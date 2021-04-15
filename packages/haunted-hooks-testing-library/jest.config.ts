import type { Config } from "@jest/types";

const esModules = ["haunted", "lit-html"].join("|");

const config: Config.InitialOptions = {
  testMatch: ["**/test/main.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx)$": "esbuild-jest",
  },
  transformIgnorePatterns: [`node_modules/(?!(${esModules})/)`]
};

export default config;

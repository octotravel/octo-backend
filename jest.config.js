module.exports = {
    roots: ["<rootDir>/src"],
    testMatch: ["**/__tests__/**/*.+(test.ts)"],
    transform: {
      "\\.ts?$": "ts-jest",
      "node_modules/@octocloud/types/\\.ts?$": "ts-jest",
      "node_modules/@octocloud/core/\\.ts?$": "ts-jest",
    },
    transformIgnorePatterns: ["node_modules/(?!@octocloud/types.*)", "node_modules/(?!@octocloud/core.*)"],
    testEnvironment: "node",
    globals: {
      "ts-jest": {
        tsconfig: "tsconfig.json",
      },
    },
    coveragePathIgnorePatterns: ["<rootDir>/src/generators"],
  };
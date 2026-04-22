/* global module */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/migrate.ts",
    "!src/app.ts",
    "!src/routes/**/*.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 40,
      lines: 40,
      statements: 40,
    },
  },
};

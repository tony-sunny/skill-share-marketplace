const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "ts-jest",
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  transformIgnorePatterns: ["/node_modules/", "^.+\\.(css|scss|sass|less)$"],
};

module.exports = createJestConfig(customJestConfig);

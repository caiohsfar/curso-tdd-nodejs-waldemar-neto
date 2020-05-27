// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
module.exports = {
  coverageDirectory: "coverage",
  // globalTeardown: undefined,
  collectCoverageFrom: ['**/src/**/*.js'],
  testEnvironment: "node",
  testPathIgnorePatterns : ["node_modules", "src/config" ]


};

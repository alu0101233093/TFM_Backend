/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testResultsProcessor: 'jest-sonar-reporter',
  detectOpenHandles: true,
  testMatch: ['**/tests/**/*.spec.ts'],
  collectCoverage: true,
};
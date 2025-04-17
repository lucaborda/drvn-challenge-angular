module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '.*\\.e2e\\.spec\\.ts$',
    '.*\\.functional\\.spec\\.ts$',
  ],
  globalSetup: 'jest-preset-angular/global-setup',
};

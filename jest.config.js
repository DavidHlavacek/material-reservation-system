module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    testEnvironment: 'jsdom',
    globals: {
      'ts-jest': {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    },
    transform: {
      '^.+\\.(ts|mjs|js|html)$': 'jest-preset-angular',
    },
    moduleNameMapper: {
      '@core/(.*)': '<rootDir>/src/app/core/$1',
      '@state/(.*)': '<rootDir>/src/app/state/$1',
      // Add more mappings as needed
    },
    transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  };
  
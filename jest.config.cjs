/**
 * Jest configuration for C4-Agent (ESM package).
 */
// Copyright (c) 2025, 2026 Jon Verrier

/** @type {import('jest').Config} */
const tsJestEsm = {
   '^.+\\.ts$': [
      'ts-jest',
      {
         useESM: true,
         tsconfig: '<rootDir>/tsconfig.jest.json'
      }
   ]
};

/** @type {import('jest').Config} */
module.exports = {
   projects: [
      {
         displayName: 'unit',
         preset: 'ts-jest/presets/default-esm',
         testEnvironment: 'node',
         extensionsToTreatAsEsm: ['.ts'],
         moduleNameMapper: {
            '^(\\.{1,2}/.*)\\.js$': '$1'
         },
         roots: ['<rootDir>/test'],
         testMatch: [
            '**/FileFunctions.test.ts',
            '**/GenerateReadMeC4.test.ts',
            '**/GenerateRollupC4.test.ts',
            '**/GenerateComponentC4.test.ts',
            '**/ShouldRegenerateReadMe.test.ts'
         ],
         transform: tsJestEsm,
         testTimeout: 10_000
      },
      {
         displayName: 'slow',
         preset: 'ts-jest/presets/default-esm',
         testEnvironment: 'node',
         extensionsToTreatAsEsm: ['.ts'],
         moduleNameMapper: {
            '^(\\.{1,2}/.*)\\.js$': '$1'
         },
         roots: ['<rootDir>/test'],
         testMatch: ['**/ParseMermaid.test.ts', '**/PreviewMermaid.test.ts'],
         transform: tsJestEsm,
         testTimeout: 60_000,
         maxWorkers: 1
      },
      {
         displayName: 'mini',
         preset: 'ts-jest/presets/default-esm',
         testEnvironment: 'node',
         extensionsToTreatAsEsm: ['.ts'],
         moduleNameMapper: {
            '^(\\.{1,2}/.*)\\.js$': '$1'
         },
         roots: ['<rootDir>/test'],
         testMatch: ['**/GenerateReadMeC4.test.ts'],
         transform: tsJestEsm,
         testTimeout: 10_000
      }
   ]
};

import { pathsToModuleNameMapper, JestConfigWithTsJest } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  moduleDirectories: ['node_modules', './src'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
} as JestConfigWithTsJest;

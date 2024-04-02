import type {Config} from 'jest';
import {defaults} from 'jest-config';

export default async (): Promise<Config> => {
  return {
    verbose: true,
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
  };
};
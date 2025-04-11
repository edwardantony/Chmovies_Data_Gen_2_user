import { defineFunction } from '@aws-amplify/backend';

export const defineAuthChallenge = defineFunction({
  name: 'defineAuthChallenge',
  entry: './handle.ts',
});

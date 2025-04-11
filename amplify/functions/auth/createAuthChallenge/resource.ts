import { defineFunction } from '@aws-amplify/backend';

export const createAuthChallenge = defineFunction({
  name: 'createAuthChallenge',
  entry: './handle.ts',
});

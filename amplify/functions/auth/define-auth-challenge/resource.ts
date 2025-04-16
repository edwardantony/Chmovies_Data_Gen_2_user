import { defineFunction } from '@aws-amplify/backend';

export const defineAuthChallenge = defineFunction({
  name: 'defineAuthChallenge',
  entry: './handler.ts',
  resourceGroupName: 'auth'
});

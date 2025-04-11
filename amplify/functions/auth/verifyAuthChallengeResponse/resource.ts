import { defineFunction } from '@aws-amplify/backend';

export const verifyAuthChallengeResponse = defineFunction({
  name: 'verifyAuthChallengeResponse',
  entry: './handle.ts',
});

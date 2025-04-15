import { defineFunction } from '@aws-amplify/backend';

export const createAuthChallenge = defineFunction({  
  name: 'createAuthChallenge',
  runtime: 20, // Node.js 20.x
  entry: './handler.ts',
});
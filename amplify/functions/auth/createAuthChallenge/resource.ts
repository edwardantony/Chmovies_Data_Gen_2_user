import { defineFunction } from '@aws-amplify/backend';

export const createAuthChallenge = defineFunction({
  name: 'createAuthChallenge', // Must use kebab-case
  entry: './handle.ts',
  // access: (allow: any) => [
  //   // SMS permissions (SNS)
  //   allow.resource('*').to(['sns:Publish']),
    
  //   // Email permissions (SES)
  //   allow.resource('*').to(['ses:SendEmail', 'ses:SendRawEmail'])
  // ]
});
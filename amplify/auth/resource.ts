// import { defineAuth } from '@aws-amplify/backend';
// import * as iam from 'aws-cdk-lib/aws-iam';
// import * as cognito from 'aws-cdk-lib/aws-cognito';
// import { Stack } from 'aws-cdk-lib';
// import { createAuthChallenge } from '../functions/auth/create-auth-challenge/resource';
// import { defineAuthChallenge } from '../functions/auth/define-auth-challenge/resource';
// import { verifyAuthChallengeResponse } from '../functions/auth/verify-auth-challenge-response/resource';

// export const auth = defineAuth({
//   loginWith: {
//     email: true,
//     phone: true,
//   },
//   multifactor: {
//     mode: 'OPTIONAL',
//     sms: true,
//     totp: true,
//   },
//   userAttributes: {
//     email: { required: true },
//     phoneNumber: { required: true }
//   },
//   accountRecovery: "EMAIL_AND_PHONE_WITHOUT_MFA",
//   // senders: {
//   //   email: {
//   //     fromEmail: "no-reply@chmovies.com",
//   //   },
//   // },
//   // triggers: {
//   //   defineAuthChallenge,
//   //   createAuthChallenge,
//   //   verifyAuthChallengeResponse,
//   // },
// });


import { referenceAuth } from '@aws-amplify/backend';

export const auth = referenceAuth({
  userPoolId: 'ap-south-1_LCC7b7JQn',
  identityPoolId: 'ap-south-1:59c9149a-2c78-447c-b16f-fe259771778a',
  authRoleArn: 'arn:aws:iam::252476278316:role/amplify-dxyn4iyt81c88-mai-amplifyAuthauthenticatedU-rWZnQRtZ2wg0',
  unauthRoleArn: 'arn:aws:iam::252476278316:role/amplify-dxyn4iyt81c88-mai-amplifyAuthunauthenticate-l5WDyeKQX9MS',
  userPoolClientId: '2u96mqb4r1c17dl31h0j5n866f',
});
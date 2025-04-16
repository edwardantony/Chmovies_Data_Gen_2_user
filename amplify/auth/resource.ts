// import { defineAuth } from '@aws-amplify/backend';
// // import { createAuthChallenge } from '../functions/auth/create-auth-challenge/resource';
// // import { defineAuthChallenge } from '../functions/auth/define-auth-challenge/resource';
// // import { verifyAuthChallengeResponse } from '../functions/auth/verify-auth-challenge-response/resource';

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
  userPoolId: 'ap-south-1_5QiOLgXyg',
  identityPoolId: 'ap-south-1:4517bcc8-da23-4e9b-8560-f900c86a8c89',
  authRoleArn: 'arn:aws:iam::252476278316:role/amplify-d1dvucxetibij3-ma-amplifyAuthUserPoolsmsRol-LfsliMvbjYEY',
  unauthRoleArn: 'arn:aws:iam::252476278316:role/amplify-d1dvucxetibij3-ma-amplifyAuthUserPoolsmsRol-LfsliMvbjYEY',
  userPoolClientId: '65hhls0ooorcrr90svcqc7ks24',
});
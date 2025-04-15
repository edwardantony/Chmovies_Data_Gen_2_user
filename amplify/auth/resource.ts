import { defineAuth } from '@aws-amplify/backend';
// import { createAuthChallenge } from '../functions/auth/create-auth-challenge/resource';
// import { defineAuthChallenge } from '../functions/auth/define-auth-challenge/resource';
// import { verifyAuthChallengeResponse } from '../functions/auth/verify-auth-challenge-response/resource';

export const auth = defineAuth({
  loginWith: {
    email: true,
    phone: true,
  },
  multifactor: {
    mode: 'OPTIONAL',
    sms: true,
    totp: true,
  },
  userAttributes: {
    email: { required: true },
    phoneNumber: { required: true }
  },
  accountRecovery: "EMAIL_AND_PHONE_WITHOUT_MFA",
  senders: {
    email: {
      fromEmail: "no-reply@chmovies.com",
    },
  },
  // triggers: {
  //   defineAuthChallenge,
  //   createAuthChallenge,
  //   verifyAuthChallengeResponse,
  // },
});


// import { referenceAuth } from '@aws-amplify/backend';

// export const auth = referenceAuth({
//   userPoolId: 'ap-south-1_h6EP2vQEL',
//   identityPoolId: 'ap-south-1:27aeb1df-6dbc-43e5-ba07-c2e3d877d4b5',
//   authRoleArn: 'arn:aws:iam::252476278316:role/amplify-chmoviesgen2user--amplifyAuthUserPoolsmsRol-1N3TqQJnWlyp',
//   unauthRoleArn: 'arn:aws:iam::252476278316:role/amplify-chmoviesgen2user--amplifyAuthUserPoolsmsRol-1N3TqQJnWlyp',
//   userPoolClientId: '57k25ft3ns3pdu5ndmt9sm5dqe',
// });
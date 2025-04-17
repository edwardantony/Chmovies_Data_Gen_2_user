import { defineAuth } from '@aws-amplify/backend';
// import * as iam from 'aws-cdk-lib/aws-iam';
// import * as cognito from 'aws-cdk-lib/aws-cognito';
// import { Stack } from 'aws-cdk-lib';
import { createAuthChallenge } from '../functions/auth/create-auth-challenge/resource';
import { defineAuthChallenge } from '../functions/auth/define-auth-challenge/resource';
import { verifyAuthChallengeResponse } from '../functions/auth/verify-auth-challenge-response/resource';

export const auth = defineAuth({
  loginWith: {
    email: true,
    phone: true,
  },
  multifactor: {
    mode: 'OPTIONAL',
    sms: true,
    totp: false,
  },
  userAttributes: {
    email: { required: true },
    phoneNumber: { required: true }
  },
  accountRecovery: "EMAIL_AND_PHONE_WITHOUT_MFA",
  // senders: {
  //   email: {
  //     fromEmail: "no-reply@chmovies.com",
  //   },
  // },
  triggers: {
    defineAuthChallenge,
    createAuthChallenge,
    verifyAuthChallengeResponse,
  },
});


// import { referenceAuth } from '@aws-amplify/backend';

// export const auth = referenceAuth({
//   userPoolId: 'ap-south-1_1b7jE1xrU',
//   identityPoolId: 'ap-south-1:12454be6-c513-4556-b728-bfeef90fd02f',
//   authRoleArn: 'arn:aws:iam::252476278316:role/amplify-chmoviesgen2user--amplifyAuthauthenticatedU-8gS5uJdgbAVy',
//   unauthRoleArn: 'arn:aws:iam::252476278316:role/amplify-chmoviesgen2user--amplifyAuthunauthenticate-BZ3tyDEQpoD5',
//   userPoolClientId: '1co6fchohnaivj14fhb6amfpa4',
// });

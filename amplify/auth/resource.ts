import { defineAuth } from '@aws-amplify/backend';
import { defineAuthChallenge } from '../functions/auth/defineAuthChallenge/resource';
import { createAuthChallenge } from '../functions/auth/createAuthChallenge/resource';
import { verifyAuthChallengeResponse } from '../functions/auth/verifyAuthChallengeResponse/resource';

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
  triggers: {
    defineAuthChallenge,
    createAuthChallenge,
    verifyAuthChallengeResponse,
  },
});


// import { referenceAuth } from '@aws-amplify/backend';

// export const auth = referenceAuth({
//   userPoolId: 'ap-south-1_Jsg3n4CWr',
//   identityPoolId: 'ap-south-1:d1c4f3b3-39ad-4017-910a-ec307992a25e',
//   authRoleArn: 'arn:aws:iam::252476278316:role/service-role/SMS-Mumbai-Auth',
//   unauthRoleArn: 'arn:aws:iam::252476278316:role/service-role/SMS-Mumbai-Auth',
//   userPoolClientId: 'stug2eil77r454d0v0pfo3uf6',
// });
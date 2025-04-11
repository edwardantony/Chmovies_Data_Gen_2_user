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
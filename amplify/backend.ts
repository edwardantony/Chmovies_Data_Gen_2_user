import * as iam from 'aws-cdk-lib/aws-iam';
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { createAuthChallenge } from './functions/auth/createAuthChallenge/resource';
import { defineAuthChallenge } from './functions/auth/defineAuthChallenge/resource';
import { verifyAuthChallengeResponse } from './functions/auth/verifyAuthChallengeResponse/resource';






defineBackend({
  auth,
  data,
  createAuthChallenge,
  defineAuthChallenge,
  verifyAuthChallengeResponse,
});




import { defineBackend } from '@aws-amplify/backend';

import { auth } from './auth/resource';
import { data } from './data/resource';


const backend = defineBackend({
  auth,
  data,
});


// const { cfnResources } = backend.auth.resources;
// const { cfnUserPool, cfnUserPoolClient } = cfnResources;

// cfnUserPool.addPropertyOverride(
//   'Policies.SignInPolicy.AllowedFirstAuthFactors',['PASSWORD', 'WEB_AUTHN', 'EMAIL_OTP', 'SMS_OTP']
// );

// cfnUserPoolClient.explicitAuthFlows = ['ALLOW_REFRESH_TOKEN_AUTH','ALLOW_USER_AUTH'];

// /* Needed for WebAuthn */
// cfnUserPool.addPropertyOverride('WebAuthnRelyingPartyID', '<RELYING_PARTY>');
// cfnUserPool.addPropertyOverride('WebAuthnUserVerification', 'preferred');





import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import * as iam from 'aws-cdk-lib/aws-iam';


// Define the backend with auth and data resources
const backend = defineBackend({
  auth,
  data
});


const { cfnResources } = backend.auth.resources;
const { cfnUserPool, cfnUserPoolClient } = cfnResources;
    
cfnUserPool.addPropertyOverride('Policies.SignInPolicy.AllowedFirstAuthFactors',[
    'PASSWORD', 
  // 'WEB_AUTHN', 
    'EMAIL_OTP', 
    'SMS_OTP'
    ]
);
    
cfnUserPoolClient.explicitAuthFlows = [
 // 'ALLOW_USER_PASSWORD_AUTH',
 // 'ALLOW_USER_SRP_AUTH',
  'ALLOW_REFRESH_TOKEN_AUTH',
  'ALLOW_CUSTOM_AUTH', // Required for OTP flows
  'ALLOW_USER_AUTH'
];
    
/* Needed for WebAuthn */
// cfnUserPool.addPropertyOverride('WebAuthnRelyingPartyID', 'chmovies.com');
// cfnUserPool.addPropertyOverride('WebAuthnUserVerification', 'preferred');
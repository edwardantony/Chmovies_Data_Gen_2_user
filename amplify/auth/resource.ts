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
    totp: true,
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
//   userPoolId: 'ap-south-1_h6EP2vQEL',
//   identityPoolId: 'ap-south-1:27aeb1df-6dbc-43e5-ba07-c2e3d877d4b5',
//   authRoleArn: 'arn:aws:iam::252476278316:role/amplify-chmoviesgen2user--amplifyAuthauthenticatedU-lEnQmfahcqgI',
//   unauthRoleArn: 'arn:aws:iam::252476278316:role/amplify-chmoviesgen2user--amplifyAuthunauthenticate-pcKyNgL81Ndb',
//   userPoolClientId: '57k25ft3ns3pdu5ndmt9sm5dqe',
// });


// export const override = (backendStack: Stack) => {
//   const authStack = backendStack.node.findChild('auth') as Stack;
  
//   // Find the User Pool construct with proper typing
//   const userPool = authStack.node.tryFindChild('UserPool') as cognito.CfnUserPool;
//   if (!userPool) {
//     throw new Error('UserPool construct not found');
//   }

//   // Find the User Pool Client construct
//   const userPoolClient = authStack.node.tryFindChild('UserPoolClient') as cognito.CfnUserPoolClient;
//   if (!userPoolClient) {
//     throw new Error('UserPoolClient construct not found');
//   }

//   // Create IAM role for Cognito with proper trust relationship
//   const cognitoRole = new iam.Role(authStack, 'CognitoServiceRole', {
//     assumedBy: new iam.ServicePrincipal('cognito-idp.amazonaws.com'), // Let Cognito assume this role
//     description: 'Service role for Cognito to send emails',
//     inlinePolicies: {
//       sesPermissions: new iam.PolicyDocument({
//         statements: [
//           new iam.PolicyStatement({
//             actions: ['ses:SendEmail', 'ses:SendRawEmail'],
//             resources: ['*'] // Ideally, scope this to your SES identity
//           })
//         ]
//       })
//     }
//   });

//   // Configure Email Settings (using proper CloudFormation property names)
//   userPool.addPropertyOverride('EmailConfiguration', {
//     EmailSendingAccount: 'DEVELOPER', // Use 'DEVELOPER' for custom email
//     From: 'no-reply@chmovies.com',
//     SourceArn: cognitoRole.roleArn
//   });

//   // Configure Password Policy
//   userPool.addPropertyOverride('Policies.PasswordPolicy', {
//     MinimumLength: 8,
//     RequireLowercase: true,
//     RequireNumbers: true,
//     RequireSymbols: true,
//     RequireUppercase: true
//   });

//   // Configure Sign-in Policy for passwordless auth
//   userPool.addPropertyOverride('Policies.SignInPolicy', {
//     AllowedFirstFactors: ['EMAIL_OTP', 'SMS_OTP', 'WEB_AUTHN']
//   });

//   // Configure Client Authentication Flows
//   userPoolClient.addPropertyOverride('ExplicitAuthFlows', [
//     'ALLOW_USER_PASSWORD_AUTH',
//     'ALLOW_USER_SRP_AUTH',
//     'ALLOW_REFRESH_TOKEN_AUTH',
//     'ALLOW_CUSTOM_AUTH' // Required for OTP flows
//   ]);

//   // Configure WebAuthn if needed
//   userPool.addPropertyOverride('WebAuthnRelyingPartyId', 'chmovies.com');
//   userPool.addPropertyOverride('WebAuthnUserVerification', 'preferred');
// };
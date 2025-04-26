import { referenceAuth } from '@aws-amplify/backend';

export const auth = referenceAuth({
  userPoolId: 'ap-south-1_VNTh0GiXY',
  identityPoolId: 'ap-south-1:95a2602c-7b78-42db-846c-1188d278a034',
  authRoleArn: 'arn:aws:iam::252476278316:role/service-role/Gen_2_Authorized_Role',
  unauthRoleArn: 'arn:aws:iam::252476278316:role/service-role/Gen_2_Un_Authorized_Role',
  userPoolClientId: '6n4f8oko78s1k3v3tk3hisrqad',
});

import { referenceAuth } from '@aws-amplify/backend';

export const auth = referenceAuth({
  userPoolId: 'ap-south-1_VNTh0GiXY',
  identityPoolId: 'ap-south-1:f1f3be8a-a1d3-404b-8d98-4ea82dd634b7',
  authRoleArn: 'arn:aws:iam::252476278316:role/amplify-d2hycfgtyep6ae-ma-amplifyAuthauthenticatedU-iyDdv6Uo04XB',
  unauthRoleArn: 'arn:aws:iam::252476278316:role/amplify-d2hycfgtyep6ae-ma-amplifyAuthunauthenticate-4WNzHWrjKHJm',
  userPoolClientId: '62duie90f5mtdcvludiv34je52',
});

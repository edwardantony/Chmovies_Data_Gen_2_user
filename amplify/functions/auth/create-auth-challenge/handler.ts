import type { CreateAuthChallengeTriggerHandler } from "aws-lambda";
import { CognitoIdentityServiceProvider } from "aws-sdk";

const cognito = new CognitoIdentityServiceProvider();

export const handler: CreateAuthChallengeTriggerHandler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  
  try {
    // Example of listing users with a specific phone number
    const params = {
      UserPoolId: 'ap-south-1_DSpgVlB9D',
      Filter: "phone_number = '918089063532'"
    };
    
    const users = await cognito.listUsers(params).promise();
    console.log('Found users:', users);
    
    // You can use the users data in your challenge logic if needed
    if (users.Users && users.Users.length > 0) {
      // User exists - maybe customize your challenge
    } else {
      // User doesn't exist - maybe handle differently
    }
    
  } catch (error) {
    console.error('Error listing users:', error);
    // Don't fail the auth process just because listing failed
  }
  
  return event;
};
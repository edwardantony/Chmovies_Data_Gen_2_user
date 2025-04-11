import { CreateAuthChallengeTriggerHandler } from 'aws-lambda';

export const handler: CreateAuthChallengeTriggerHandler = async (event) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  console.log(`Sending OTP ${code} to ${event.request.userAttributes.phone_number}`);

  // In real app, send via SMS/Email (e.g., SNS or SES)
  event.response.publicChallengeParameters = { message: 'Enter the OTP sent to your phone' };
  event.response.privateChallengeParameters = { answer: code };
  event.response.challengeMetadata = `OTP-${code}`;

  return event;
};

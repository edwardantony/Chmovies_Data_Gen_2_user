import { CreateAuthChallengeTriggerHandler } from 'aws-lambda';

export const handler: CreateAuthChallengeTriggerHandler = async (event) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const { email, phone_number } = event.request.userAttributes;
  const preferredChannel = event.request.clientMetadata?.preferredChannel;

  console.log('User attributes:', { email, phone_number });
  console.log('Preferred OTP channel:', preferredChannel);
  console.log(`Generated OTP: ${code}`);

  let message = '';

  if (preferredChannel === 'phone' && phone_number) {
    console.log(`Sending OTP ${code} to phone: ${phone_number}`);
    message = 'Enter the OTP sent to your phone';
    // TODO: Send SMS
  } else if (preferredChannel === 'email' && email) {
    console.log(`Sending OTP ${code} to email: ${email}`);
    message = 'Enter the OTP sent to your email';
    // TODO: Send email
  } else if (phone_number) {
    console.log(`Fallback: Sending OTP ${code} to phone`);
    message = 'Enter the OTP sent to your phone';
  } else if (email) {
    console.log(`Fallback: Sending OTP ${code} to email`);
    message = 'Enter the OTP sent to your email';
  } else {
    console.warn('No delivery method found');
    message = 'OTP delivery failed. Contact support.';
  }

  event.response.publicChallengeParameters = { message };
  event.response.privateChallengeParameters = { answer: code };
  event.response.challengeMetadata = `OTP-${code}`;

  return event;
};

import { CreateAuthChallengeTriggerHandler } from 'aws-lambda';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const ses = new SESClient({ region: 'ap-south-1' });
const sns = new SNSClient({ region: 'ap-south-1' });

export const handler: CreateAuthChallengeTriggerHandler = async (event) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const { email, phone_number } = event.request.userAttributes;
  const preferredChannel = event.request.clientMetadata?.preferredChannel;

  console.log('User attributes:', { email, phone_number });
  console.log('Preferred OTP channel:', preferredChannel);
  console.log(`Generated OTP: ${code}`);

  let message = '';
  let sent = false;

  if (preferredChannel === 'email' && email) {
    try {
      await sendOtpEmail(email, code);
      message = 'Enter the OTP sent to your email';
      sent = true;
    } catch (err) {
      console.error('Failed to send OTP via email:', err);
    }
  }

  if (!sent && preferredChannel === 'phone' && phone_number) {
    try {
      await sendOtpSms(phone_number, code);
      message = 'Enter the OTP sent to your phone';
      sent = true;
    } catch (err) {
      console.error('Failed to send OTP via SMS:', err);
    }
  }

  // Fallbacks
  if (!sent && phone_number) {
    try {
      await sendOtpSms(phone_number, code);
      message = 'Enter the OTP sent to your phone';
      sent = true;
    } catch (err) {
      console.error('Fallback SMS failed:', err);
    }
  }

  if (!sent && email) {
    try {
      await sendOtpEmail(email, code);
      message = 'Enter the OTP sent to your email';
      sent = true;
    } catch (err) {
      console.error('Fallback Email failed:', err);
    }
  }

  if (!sent) {
    console.warn('No delivery method available');
    message = 'OTP delivery failed. Contact support.';
  }

  event.response.publicChallengeParameters = { message };
  event.response.privateChallengeParameters = { answer: code };
  event.response.challengeMetadata = `OTP-${code}`;

  return event;
};

// --- SES Email
async function sendOtpEmail(toEmail: string, otp: string) {
  const command = new SendEmailCommand({
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Body: {
        Text: { Data: `Your verification code is: ${otp}` },
      },
      Subject: { Data: 'Your One-Time Passcode (OTP)' },
    },
    Source: 'your-verified-sender@example.com', // ✅ Must be verified
  });
  await ses.send(command);
}

// --- SNS SMS
async function sendOtpSms(phone: string, otp: string) {
  const command = new PublishCommand({
    PhoneNumber: phone,
    Message: `Your verification code is: ${otp}`,
  });
  await sns.send(command);
}

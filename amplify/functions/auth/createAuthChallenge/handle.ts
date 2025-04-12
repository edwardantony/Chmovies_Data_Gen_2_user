import { CreateAuthChallengeTriggerHandler } from 'aws-lambda';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// ✅ Set your region and verified sender
const ses = new SESClient({ region: 'ap-south-1' });
const SENDER_EMAIL = 'your-verified-sender@example.com'; // Must be verified in SES

export const handler: CreateAuthChallengeTriggerHandler = async (event) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
  const { email, phone_number } = event.request.userAttributes;

  console.log('User attributes:', { email, phone_number });
  console.log(`Generated OTP: ${code}`);

  if (email) {
    try {
      await sendOtpEmail(email, code);
      console.log(`OTP ${code} sent to email: ${email}`);
    } catch (error) {
      console.error('Error sending OTP email:', error);
    }
  } else if (phone_number) {
    console.log(`Sending OTP ${code} to phone: ${phone_number}`);
    // Optional: Add actual SMS logic here later
  } else {
    console.warn('No email or phone_number found to send OTP.');
  }

  event.response.publicChallengeParameters = {
    message: email
      ? 'Enter the OTP sent to your email'
      : 'Enter the OTP sent to your phone',
  };

  event.response.privateChallengeParameters = { answer: code };
  event.response.challengeMetadata = `OTP-${code}`;

  return event;
};

// ✅ Real SES email sender function
async function sendOtpEmail(toEmail: string, otp: string) {
  const emailCommand = new SendEmailCommand({
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Subject: {
        Data: 'Your One-Time Passcode (OTP)',
      },
      Body: {
        Text: {
          Data: `Your verification code is: ${otp}`,
        },
        Html: {
          Data: `<p>Your verification code is:</p><h2>${otp}</h2>`,
        },
      },
    },
    Source: SENDER_EMAIL,
  });

  await ses.send(emailCommand);
}

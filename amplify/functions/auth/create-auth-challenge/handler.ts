import { CreateAuthChallengeTriggerHandler } from "aws-lambda";
import AWS from "aws-sdk";

// Initialize AWS SES and SNS clients
const ses = new AWS.SES();
const sns = new AWS.SNS();

// Helper function to send OTP via email
const sendOtpEmail = async (email: string, otp: string) => {
  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: {
          Data: `Your verification code is: ${otp}`,
        },
      },
      Subject: {
        Data: "Your OTP Verification Code",
      },
    },
    Source: "no-reply@chmovies.com", // Make sure this is verified in SES
  };

  try {
    await ses.sendEmail(params).promise();
    console.log("OTP email sent successfully to:", email);
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};

// Helper function to send OTP via SMS
const sendOtpSms = async (phoneNumber: string, otp: string) => {
  const params = {
    Message: `Your verification code is: ${otp}`,
    PhoneNumber: phoneNumber, // E.g., "+1234567890"
  };

  try {
    await sns.publish(params).promise();
    console.log("OTP SMS sent successfully to:", phoneNumber);
  } catch (error) {
    console.error("Error sending OTP SMS:", error);
  }
};

// Main handler function
export const handler: CreateAuthChallengeTriggerHandler = async (event) => {
  console.log("🚀 createAuthChallenge - Triggered with event:", JSON.stringify(event, null, 2));

  if (event.request.challengeName === "CUSTOM_CHALLENGE") {
    // Generate a random OTP or use static for testing
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Random 6-digit OTP

    console.log(`🔐 Generated OTP: ${otp}`);

    const { email, phone_number } = event.request.userAttributes; // Get user attributes
    const selectedOtpChannel = event.request.clientMetadata?.preferredChannel; // Default to email if no channel is set

    // Send OTP based on the selected channel
    if (selectedOtpChannel === 'email' && email) {
      await sendOtpEmail(email, otp);
    } else if (selectedOtpChannel === 'phone' && phone_number) {
      await sendOtpSms(phone_number, otp);
    } else {      
      console.error("Invalid or missing channel information");
      throw new Error("Invalid or missing channel information");
    }
    console.log("SELECTED OTP CHANNEL", event.request);

    // Setting up challenge response
    event.response.challengeMetadata = "TOKEN_CHECK";

    event.response.publicChallengeParameters = {
      trigger: "true", // Can be used by frontend to know a challenge is required
      code: otp, // Sending OTP as debug code
    };

    event.response.privateChallengeParameters = {
      trigger: "true",
      answer: otp, // OTP will be validated in verifyAuthChallengeResponse
    };
  } else {
    console.warn("⚠️ Unsupported challenge type:", event.request.challengeName);
  }

  return event;
};

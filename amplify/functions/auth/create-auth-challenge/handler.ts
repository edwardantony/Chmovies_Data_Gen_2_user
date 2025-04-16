import { CreateAuthChallengeTriggerHandler } from "aws-lambda";
import AWS from "aws-sdk";

const ses = new AWS.SES();
const sns = new AWS.SNS();

// Send OTP via email
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
    Source: "no-reply@chmovies.com", 
  };

  try {
    await ses.sendEmail(params).promise();
    console.log("✅ OTP email sent to:", email);
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    throw error;
  }
};

// Send OTP via SMS
const sendOtpSms = async (phoneNumber: string, otp: string) => {
  const params = {
    Message: `Your verification code is: ${otp}`,
    PhoneNumber: phoneNumber,
  };

  try {
    await sns.publish(params).promise();
    console.log("✅ OTP SMS sent to:", phoneNumber);
  } catch (error) {
    console.error("❌ Failed to send OTP SMS:", error);
    throw error;
  }
};

export const handler: CreateAuthChallengeTriggerHandler = async (event) => {
  console.log("🚀 createAuthChallenge Triggered");
  console.log("🔧 Full Event:", JSON.stringify(event, null, 2));

  if (event.request.challengeName === "CUSTOM_CHALLENGE") {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    console.log(`🔐 Generated OTP: ${otp}`);

    const email = event.request.userAttributes.email;
    const phone_number = event.request.userAttributes.phone_number;
    console.log("📧 Email:", email);
    console.log("📱 Phone:", phone_number);
    console.log("📱 EVENT:", event.request);

    // Prefer email if available, else fallback to phone
    try {
      if (email) {
        await sendOtpEmail(email, otp);
      } else if (phone_number) {
        await sendOtpSms(phone_number, otp);
      } else {
        throw new Error("No email or phone number found to send OTP");
      }
    } catch (error) {
      console.error("❌ OTP sending failed:", error);
      throw new Error("OTP delivery failed");
    }

    // Challenge setup
    event.response.challengeMetadata = "TOKEN_CHECK";
    event.response.publicChallengeParameters = {
      trigger: "true",
      code: otp, // ⚠️ Remove in production!
    };
    event.response.privateChallengeParameters = {
      trigger: "true",
      answer: otp,
    };
  } else {
    console.warn("⚠️ Unsupported challenge type:", event.request.challengeName);
  }

  return event;
};

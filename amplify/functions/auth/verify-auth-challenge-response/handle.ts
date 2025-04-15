import type { VerifyAuthChallengeResponseTriggerHandler } from "aws-lambda";

export const handler: VerifyAuthChallengeResponseTriggerHandler = async (event) => {
  const expectedAnswer = event.request.privateChallengeParameters?.answer;
  const userAnswer = event.request.challengeAnswer;

  console.log("🔐 Verifying Auth Challenge Response");
  console.log("🧾 Expected Answer:", expectedAnswer);
  console.log("✍️ User Answer:", userAnswer);

  event.response.answerCorrect = userAnswer === expectedAnswer;

  if (event.response.answerCorrect) {
    console.log("✅ Correct challenge answer. Authentication succeeds.");
  } else {
    console.warn("❌ Incorrect challenge answer. Authentication fails.");
  }

  return event;
};

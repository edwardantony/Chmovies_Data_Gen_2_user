import type { VerifyAuthChallengeResponseTriggerHandler } from "aws-lambda";

export const handler: VerifyAuthChallengeResponseTriggerHandler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  event.response.answerCorrect = true;

  // Log the final response being returned
  console.log("Returning response:", JSON.stringify(event.response, null, 2));

  return event;
};

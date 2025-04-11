import { VerifyAuthChallengeResponseTriggerHandler } from 'aws-lambda';

export const handler: VerifyAuthChallengeResponseTriggerHandler = async (event) => {
  const expectedAnswer = event.request.privateChallengeParameters.answer;
  const userAnswer = event.request.challengeAnswer;

  event.response.answerCorrect = userAnswer === expectedAnswer;

  return event;
};

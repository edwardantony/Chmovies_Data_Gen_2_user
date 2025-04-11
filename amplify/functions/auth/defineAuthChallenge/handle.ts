import { DefineAuthChallengeTriggerHandler } from 'aws-lambda';

export const handler: DefineAuthChallengeTriggerHandler = async (event) => {
  if (event.request.session.length === 1 && event.request.session[0].challengeName === 'SRP_A') {
    // Password flow — allow Cognito to continue
    return event;
  }

  const lastChallenge = event.request.session.slice(-1)[0];
  if (lastChallenge?.challengeName === 'CUSTOM_CHALLENGE' && lastChallenge.challengeResult === true) {
    event.response.issueTokens = true;
    event.response.failAuthentication = false;
  } else if (event.request.session.length >= 3) {
    event.response.issueTokens = false;
    event.response.failAuthentication = true;
  } else {
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = 'CUSTOM_CHALLENGE';
  }

  return event;
};

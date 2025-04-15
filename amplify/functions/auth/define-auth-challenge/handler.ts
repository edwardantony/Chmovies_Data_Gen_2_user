import type { DefineAuthChallengeTriggerHandler } from "aws-lambda";

export const handler: DefineAuthChallengeTriggerHandler = async (event) => {
  console.log("🧠 defineAuthChallenge - Session State:", JSON.stringify(event.request.session, null, 2));

  const session = event.request.session;

  if (session.length === 0) {
    // First auth attempt — initiate custom challenge
    console.log("🔄 First auth attempt. Initiating CUSTOM_CHALLENGE.");
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = "CUSTOM_CHALLENGE";

  } else if (
    session.length === 1 &&
    session[0].challengeName === "CUSTOM_CHALLENGE" &&
    session[0].challengeResult === true
  ) {
    // Successful response to 1st custom challenge
    console.log("✅ Custom challenge passed. Issuing tokens.");
    event.response.issueTokens = true;
    event.response.failAuthentication = false;

  } else {
    // Any other case (failed challenge or unexpected session) — fail
    console.warn("❌ Challenge failed or unexpected session state. Failing authentication.");
    event.response.issueTokens = false;
    event.response.failAuthentication = true;
  }

  return event;
};

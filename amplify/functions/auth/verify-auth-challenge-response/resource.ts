import { defineFunction, secret } from "@aws-amplify/backend"

export const verifyAuthChallengeResponse = defineFunction({
  name: "verify-auth-challenge-response",
  resourceGroupName: 'auth',
  entry: './handler.ts'
})
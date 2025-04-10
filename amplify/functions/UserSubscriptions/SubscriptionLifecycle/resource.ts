import { defineFunction } from "@aws-amplify/backend";
    
export const subscriptionLifecycle = defineFunction({
  name: "subscriptionLifecycle",
  entry: "./handler.ts"
});
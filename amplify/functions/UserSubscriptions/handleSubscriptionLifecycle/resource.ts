import { defineFunction } from "@aws-amplify/backend";
    
export const handleSubscriptionLifecycle = defineFunction({
  name: "handleSubscriptionLifecycle",
  entry: "./handler.ts"
});
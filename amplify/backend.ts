import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { subscriptionLifecycle } from './functions/UserSubscriptions/SubscriptionLifecycle/resource';


defineBackend({
  auth,
  data,
  subscriptionLifecycle,
});

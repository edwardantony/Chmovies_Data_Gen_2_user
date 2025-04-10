import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { handleSubscriptionLifecycle } from './functions/UserSubscriptions/handleSubscriptionLifecycle/resource';

defineBackend({
  handleSubscriptionLifecycle,
});

defineBackend({
  auth,
  data,
});

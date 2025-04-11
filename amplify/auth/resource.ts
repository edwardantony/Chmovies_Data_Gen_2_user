import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
    phone: true,
  },
  multifactor: {
    mode: 'OPTIONAL',
    sms: true,
    totp: true,
  },
  userAttributes: {
    email: { required: true },
    phoneNumber: { required: true }
  },
});
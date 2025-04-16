'use client';

import { useState } from 'react';
import { signIn, confirmSignIn, resendSignUpCode } from 'aws-amplify/auth';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';
import '@/app/components/lib/auth/amplify-config';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [challengeType, setChallengeType] = useState<'EMAIL_OTP' | 'SMS_OTP' | 'PASSWORD'>('EMAIL_OTP');
  const [otpCode, setOtpCode] = useState('');
  const [nextStep, setNextStep] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { nextStep } = await signIn({
        username,
        options: {
          authFlowType: 'USER_AUTH',
          preferredChallenge: challengeType,
        },
      });

      if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE' || nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        toast.success('Challenge sent. Check your ' + (challengeType === 'SMS_OTP' ? 'phone' : 'email'));
        setNextStep(nextStep);
      } else if (nextStep.signInStep === 'DONE') {
        toast.success('Logged in!');
      } else {
        toast.error('Unexpected step: ' + nextStep.signInStep);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const result = await confirmSignIn({
        challengeResponse: otpCode,
      });

      if (result.isSignedIn) {
        toast.success('Signed in successfully!');
      } else {
        toast.error('Challenge confirmation failed');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendSignUpCode();
      toast.success('Code resent!');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to resend code');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-900 text-white rounded-2xl shadow-lg space-y-4">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <div className="space-y-2">
        <label className="block text-sm">Email or Phone</label>
        <Input
          placeholder="email@example.com or +91xxxxxxxxxx"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="block text-sm">Login Method</label>
        <select
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          value={challengeType}
          onChange={(e) => setChallengeType(e.target.value as any)}
        >
          <option value="EMAIL_OTP">Email OTP</option>
          <option value="SMS_OTP">SMS OTP</option>
          <option value="PASSWORD">Password</option>
        </select>
      </div>

      {!nextStep ? (
        <Button className="w-full mt-4" disabled={loading} onClick={handleSignIn}>
          {loading ? 'Signing in...' : 'Continue'}
        </Button>
      ) : (
        <div className="space-y-3">
          <Input
            placeholder="Enter OTP or Password"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
          />
          <Button className="w-full" disabled={loading} onClick={handleConfirm}>
            {loading ? 'Verifying...' : 'Verify'}
          </Button>
          <button onClick={handleResend} className="text-sm text-blue-400 hover:underline">
            Resend Code
          </button>
        </div>
      )}
    </div>
  );
}

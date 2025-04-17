'use client';

import { useState, FormEvent } from 'react';
import { signIn, confirmSignIn } from 'aws-amplify/auth';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import '@/app/components/lib/auth/amplify-config';

export default function OtpLogin() {
  const [username, setUsername] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'start' | 'otp'>('start');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStartLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!username) {
      toast.error('Please enter your email or phone');
      return;
    }

    setIsLoading(true);
    try {
      const { nextStep } = await signIn({
        username,
        options: {
          authFlowType: 'CUSTOM_WITHOUT_SRP',
        },
      });

      console.debug('SignIn nextStep:', nextStep);

      if (nextStep.signInStep === 'CONTINUE_SIGN_IN_WITH_FIRST_FACTOR_SELECTION') {
        const available = nextStep.availableChallenges || [];

        console.log(available)

        const preferredChallenge = available.includes('SMS_OTP')
          ? 'SMS_OTP'
          : available.includes('EMAIL_OTP')
          ? 'EMAIL_OTP'
          : available[0];

        if (!preferredChallenge) {
          toast.error('No supported challenges available');
          return;
        }

        const { nextStep: confirmStep } = await confirmSignIn({
          challengeResponse: preferredChallenge,
        });

        if (
          confirmStep.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE' ||
          confirmStep.signInStep === 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE'
        ) {
          setStep('otp');
          toast.success('OTP sent!');
        } else {
          toast.error('Unexpected step after challenge selection: ' + confirmStep.signInStep);
        }
      } else if (
        nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE' ||
        nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE'
      ) {
        setStep('otp');
        toast.success('OTP sent!');
      } else {
        toast.error('Unexpected sign-in step: ' + nextStep.signInStep);
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      toast.error(err.message || 'Failed to start login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!otpCode) {
      toast.error('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    try {
      const { isSignedIn, nextStep } = await confirmSignIn({
        challengeResponse: otpCode,
      });

      if (isSignedIn) {
        toast.success('Login successful!');
        router.push('/dashboard');
      } else {
        toast.error('Unexpected step: ' + nextStep?.signInStep);
      }
    } catch (err: any) {
      console.error('OTP verification failed:', err);
      toast.error(err.message || 'Invalid OTP or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 text-white rounded-2xl shadow-lg space-y-6">
      <h2 className="text-xl font-bold text-center">Login with OTP</h2>

      {step === 'start' && (
        <form onSubmit={handleStartLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Email or Phone"
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded disabled:opacity-50"
          >
            {isLoading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleConfirmOtp} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter OTP"
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 rounded disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      )}
    </div>
  );
}

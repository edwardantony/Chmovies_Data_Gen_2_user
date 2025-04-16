'use client';

import { useState, FormEvent } from 'react';
import { signIn, confirmSignIn } from 'aws-amplify/auth';
import toast from 'react-hot-toast';
import '@/app/components/lib/auth/amplify-config'

export default function OtpLogin() {
  const [username, setUsername] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'start' | 'otp'>('start');
  const [isLoading, setIsLoading] = useState(false);

  const handleStartLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { nextStep } = await signIn({
        username, // email or phone
        options: {
          authFlowType: 'USER_AUTH',
          preferredChallenge: 'SMS_OTP'
        },
      });

      console.debug('signIn nextStep:', nextStep);
      if (nextStep.signInStep === 'CONTINUE_SIGN_IN_WITH_FIRST_FACTOR_SELECTION') {
        console.log('Available options:', JSON.stringify(nextStep));
      
        // Show UI to select preferred method
        // e.g., EMAIL_OTP or SMS_OTP
      }

      if (
        nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE' ||
        nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE'
      ) {
        setStep('otp');
        toast.success('OTP sent!');
      } else {
        toast.error('Unexpected step: ' + nextStep.signInStep);
      }
    } catch (err) {
      console.error('SignIn error:', err);
      toast.error('Failed to start login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmOtp = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { nextStep } = await confirmSignIn({ challengeResponse: otpCode });

      if (nextStep.signInStep === 'DONE') {
        toast.success('Login successful!');
        // Redirect or update UI
      } else {
        toast.error('Unexpected step: ' + nextStep.signInStep);
      }
    } catch (err) {
      console.error('OTP verification failed:', err);
      toast.error('Invalid OTP or expired.');
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

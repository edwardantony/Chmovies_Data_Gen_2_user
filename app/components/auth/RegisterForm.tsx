'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import '@/app/components/lib/auth/amplify-config';

const SignupForm = () => {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>(''); // Use string to support all numeric inputs
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleNextEmail = (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email is required');
      return;
    }
    setStep(2);
  };

  const handleNextPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error('All password fields are required');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signUp({
        username: email,
        password,
      });
      console.debug('Signup success:', res);
      toast.success('Account created! Check your email for the code.');
      setUsername(email);
      setStep(3);
    } catch (err: unknown) {
      console.error('Signup error:', err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Signup failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!otpCode) {
      toast.error('OTP code is required');
      return;
    }

    setIsLoading(true);
    try {
      const res = await confirmSignUp({ username, confirmationCode: otpCode });
      console.debug('OTP verification success:', res);
      toast.success('Account verified! Redirecting to login...');
      router.push('/login');
    } catch (err: unknown) {
      console.error('OTP verification failed:', err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Verification failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900 text-white p-6 rounded-2xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-center">Sign Up</h2>

      {step === 1 && (
        <form onSubmit={handleNextEmail} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-gray-800 border border-gray-700"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
          <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded">
            Next
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleNextPassword} className="space-y-4">
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-gray-800 border border-gray-700"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 rounded bg-gray-800 border border-gray-700"
            value={confirmPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter OTP Code"
            className="w-full p-3 rounded bg-gray-800 border border-gray-700"
            value={otpCode}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setOtpCode(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 rounded disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>
      )}
    </div>
  );
};

export default SignupForm;

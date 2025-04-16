'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import zxcvbn from 'zxcvbn';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import '@/app/components/lib/auth/amplify-config';

const SignupForm = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState<string>('');
  const [username, setUsername] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(60);

  const passwordStrength = zxcvbn(password || '');

  useEffect(() => {
    if (step === 4 && resendTimeout > 0) {
      const interval = setInterval(() => {
        setResendTimeout((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, resendTimeout]);

  const handleNextEmail = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error('Email is required');
    setStep(2);
  };

  const handleNextPassword = (e: FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) return toast.error('All password fields are required');
    if (password !== confirmPassword) return toast.error('Passwords do not match');
    if (passwordStrength.score < 3) return toast.error('Password is too weak');
    setStep(3);
  };

  const handleSubmitPhone = async (e: FormEvent) => {
    e.preventDefault();
    if (!phone) return toast.error('Phone number is required');
    if (!agreeToTerms) return toast.error('You must agree to the terms');

    setIsLoading(true);
    try {
      const res = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            phone_number: phone,
          },
        },
      });
      console.debug('Signup success:', res);
      toast.success('Account created! OTP sent to phone.');
      setUsername(email);
      setStep(4);
    } catch (err: unknown) {
      console.error('Signup error:', err);
      if (err instanceof Error) toast.error(err.message);
      else toast.error('Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!otpCode) return toast.error('OTP code is required');

    setIsLoading(true);
    try {
      const res = await confirmSignUp({ username, confirmationCode: otpCode });
      console.debug('OTP verification success:', res);
      toast.success('Account verified! Redirecting...');
      router.push('/login');
    } catch (err: unknown) {
      console.error('OTP verification failed:', err);
      if (err instanceof Error) toast.error(err.message);
      else toast.error('Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            phone_number: phone,
          },
        },
      });
      toast.success('OTP resent to your phone');
      setResendTimeout(60);
    } catch (err: any) {
      toast.error('Failed to resend OTP');
      console.error(err);
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
          {password && (
            <p className="text-sm">
              Strength:{' '}
              <span className={`font-bold ${passwordStrength.score >= 3 ? 'text-green-400' : 'text-red-400'}`}>
                {passwordStrength.score >= 3 ? 'Strong' : 'Weak'}
              </span>
            </p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmitPhone} className="space-y-4">
          <PhoneInput
            defaultCountry="IN"
            placeholder="Phone number"
            value={phone}
            onChange={setPhone}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
          />
          <label className="flex items-center text-sm space-x-2">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={() => setAgreeToTerms(!agreeToTerms)}
              className="accent-indigo-600"
            />
            <span>I agree to the Terms and Privacy Policy</span>
          </label>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded disabled:opacity-50"
          >
            {isLoading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      )}

      {step === 4 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter OTP Code"
            className="w-full p-3 rounded bg-gray-800 border border-gray-700"
            value={otpCode}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setOtpCode(e.target.value)}
          />
          <div className="flex justify-between items-center text-sm">
            <span>Didn’t get code?</span>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendTimeout > 0}
              className="text-indigo-400 hover:underline disabled:opacity-50"
            >
              {resendTimeout > 0 ? `Resend OTP in ${resendTimeout}s` : 'Resend OTP'}
            </button>
          </div>
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

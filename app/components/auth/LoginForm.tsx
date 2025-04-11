"use client";

import { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { signIn, confirmSignIn } from 'aws-amplify/auth';
import { toast } from 'react-hot-toast';
import '@/app/components/auth/amplify-config';

export default function LoginForm() {
  const [loginType, setLoginType] = useState<'password' | 'otp'>('password');
  const [step, setStep] = useState<'login' | 'verify'>('login');
  const [userInput, setUserInput] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const username = userInput.trim();
    console.log('🚀 Attempting login with:', { loginType, username });

    try {
      if (loginType === 'password') {
        const result = await signIn({ username, password });
        console.log('✅ Password login result:', result);

        if (result.isSignedIn) {
          toast.success('Logged in successfully!');
        } else {
          toast.error('Login failed, please try again');
        }
      } else {
        const result = await signIn({
          username,
          options: { authFlowType: 'CUSTOM_WITHOUT_SRP' },
        });

        console.log('📩 OTP challenge initiated:', result);
        setUser(result);
        setStep('verify');
        toast.success('OTP sent!');
      }
    } catch (err: any) {
      console.error('❌ Login error:', err);
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    console.log('🛂 Verifying OTP with code:', code);

    try {
      const result = await confirmSignIn({ challengeResponse: code });
      console.log('✅ OTP verification result:', result);

      if (result.isSignedIn) {
        toast.success('OTP verified and logged in!');
      } else {
        toast.error('OTP verification failed');
      }
    } catch (err: any) {
      console.error('❌ OTP verification error:', err);
      toast.error(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!userInput) return toast.error("Enter your email or phone first");

    console.log('🔁 Resending OTP for:', userInput);
    setLoading(true);

    try {
      const result = await signIn({
        username: userInput.trim(),
        options: { authFlowType: 'CUSTOM_WITHOUT_SRP' },
      });

      console.log('📤 Resend OTP result:', result);
      setUser(result);
      toast.success('OTP resent successfully!');
    } catch (err: any) {
      console.error('❌ Resend OTP error:', err);
      toast.error(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 rounded-xl shadow-md text-white">
      {step === 'login' ? (
        <>
          <Input
            label="Email or Phone"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          {loginType === 'password' && (
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
          <Button onClick={handleLogin} disabled={loading}>
            {loading
              ? 'Logging in...'
              : loginType === 'password'
              ? 'Login with Password'
              : 'Send OTP'}
          </Button>
          <p className="mt-4 text-sm text-center">
            {loginType === 'password' ? (
              <button
                onClick={() => setLoginType('otp')}
                className="text-blue-400 hover:underline"
              >
                Use OTP Instead
              </button>
            ) : (
              <button
                onClick={() => setLoginType('password')}
                className="text-blue-400 hover:underline"
              >
                Use Password Instead
              </button>
            )}
          </p>
        </>
      ) : (
        <>
          <Input
            label="Enter OTP Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button onClick={handleVerify} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>
          <button
            onClick={handleResendOTP}
            className="mt-2 text-sm text-blue-300 hover:underline"
          >
            Resend OTP
          </button>
        </>
      )}
    </div>
  );
}

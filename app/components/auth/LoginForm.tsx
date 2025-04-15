'use client';

import { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { signIn, confirmSignIn, resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { toast } from 'react-hot-toast';
import '@/app/components/lib/auth/amplify-config';

const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
const isPhoneNumber = (value: string) => /^\+?[1-9]\d{1,14}$/.test(value);

export default function LoginForm() {
  const [loginType, setLoginType] = useState<'password' | 'otp' | 'resetPassword'>('password');
  const [selectedOtpChannel, setSelectedOtpChannel] = useState<'email' | 'phone'>('email');
  const [step, setStep] = useState<'login' | 'verify' | 'reset'>('login');
  const [userInput, setUserInput] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const username = userInput.trim();
    const isEmailInput = isEmail(username);
    const isPhoneInput = isPhoneNumber(username);

    console.log('🔐 Login Attempt:', { loginType, step, username, isEmailInput, isPhoneInput });

    if (!isEmailInput && !isPhoneInput) {
      toast.error('Please enter a valid email or phone number');
      setLoading(false);
      return;
    }

    try {
      if (loginType === 'password') {
        const result = await signIn({ username, password });
        console.log('✅ Password Login Result:', result);

        if (result.isSignedIn) {
          toast.success('Logged in successfully!');
        } else if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
          const missing = result.nextStep?.missingAttributes || [];
          console.log('⚠️ Password Reset Required. Missing:', missing);

          if (missing.includes('phone_number')) {
            toast.error('Phone number required. Switching to OTP login.');
            setLoginType('otp');
            setStep('login');
          } else {
            toast('Password needs to be reset.');
            setLoginType('resetPassword');
            setStep('reset');
          }
        } else if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE') {
          console.log('📨 Custom Challenge Initiated (OTP)');
          setUser(result);
          setLoginType('otp');
          setStep('verify');
          toast.success('OTP challenge sent!');
        } else {
          console.log('❌ Login failed step:', result.nextStep);
          toast.error('Login failed, please try again');
        }
      } else {
        const result = await signIn({
          username,
          options: {
            authFlowType: 'CUSTOM_WITHOUT_SRP',
            clientMetadata: {
              preferredChannel: selectedOtpChannel, // either "email" or "phone"
            },
          },
        });
        console.log('📨 OTP Login Challenge Result:', result);
        setUser(result);
        setStep('verify');
        toast.success(`OTP sent to your ${isEmailInput ? 'email' : 'phone'}`);
      }
    } catch (err: any) {
      console.error('🚨 Login Error:', err);
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    console.log('🔍 Verifying OTP with code:', code);
    setLoading(true);
    try {
      const result = await confirmSignIn({ challengeResponse: code });
      console.log('✅ OTP Verification Result:', result);

      if (result.isSignedIn) {
        toast.success('OTP Verified and Logged in!');
      }
    } catch (err: any) {
      console.error('🚨 OTP Verification Error:', err);
      toast.error(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const username = userInput.trim();
    console.log('📤 Sending Reset Code to:', username);
    setLoading(true);
    try {
      const result = await resetPassword({ username });
      console.log('📨 Reset Code Sent Result:', result);
      toast.success('Reset code sent to your email/phone');
      setStep('verify');
    } catch (err: any) {
      console.error('🚨 Reset Password Error:', err);
      toast.error(err.message || 'Error sending reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmResetPassword = async () => {
    const username = userInput.trim();
    console.log('🔁 Confirm Reset Password:', { username, code, password });

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const result = await confirmResetPassword({
        username,
        confirmationCode: code,
        newPassword: password,
      });
      console.log('✅ Reset Password Confirmation Result:', result);
      toast.success('Password reset successful. Please login.');
      setLoginType('password');
      setStep('login');
    } catch (err: any) {
      console.error('🚨 Confirm Reset Password Error:', err);
      toast.error(err.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  console.log(selectedOtpChannel)

  const renderTabs = () => (
    <div className="flex justify-center space-x-4 mb-4">
      <button
        onClick={() => {
          console.log('🧭 Switched to Password Login');
          setLoginType('password');
          setStep('login');
        }}
        className={`py-2 px-4 ${loginType === 'password' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'}`}
      >
        Login with Password
      </button>
      <button
        onClick={() => {
          console.log('🧭 Switched to OTP Login');
          setLoginType('otp');
          setStep('login');
        }}
        className={`py-2 px-4 ${loginType === 'otp' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'}`}
      >
        Login with OTP
      </button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 rounded-xl shadow-md text-white">
      {renderTabs()}

      {step === 'login' && (
        <>
          <Input label="Email or Phone" value={userInput} onChange={(e) => setUserInput(e.target.value)} />
          {loginType === 'password' && (
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          )}
          <Button onClick={handleLogin} disabled={loading}>
            {loading ? 'Logging in...' : loginType === 'password' ? 'Login with Password' : 'Send OTP'}
          </Button>
          {loginType === 'password' && (
            <p className="mt-4 text-sm text-center">
              Forgot password?{' '}
              <button onClick={() => setLoginType('resetPassword')} className="text-blue-400 hover:underline">
                Reset it
              </button>
            </p>
          )}
        </>
      )}

      {step === 'verify' && loginType === 'otp' && (
        <>
          <Input label="Enter OTP Code" value={code} onChange={(e) => setCode(e.target.value)} />
          <Button onClick={handleVerify} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>
          <button
            onClick={() => {
              if (!userInput) return toast.error('Enter your email/phone first');
              console.log('🔄 Resending OTP to:', userInput);
              signIn({ username: userInput, options: { authFlowType: 'USER_AUTH', preferredChallenge: "EMAIL_OTP" } })
                .then((res) => {
                  console.log('📨 Resend OTP Result:', res);
                  toast.success('OTP resent!');
                  setUser(res);
                })
                .catch((err) => {
                  console.error('🚨 Resend OTP Error:', err);
                  toast.error(err.message || 'Failed to resend');
                });
            }}
            className="mt-2 text-sm text-blue-300 hover:underline"
          >
            Resend OTP
          </button>
        </>
      )}

      {step === 'reset' && loginType === 'resetPassword' && (
        <>
          <Input label="Verification Code" value={code} onChange={(e) => setCode(e.target.value)} />
          <Input label="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button onClick={handleConfirmResetPassword} disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </>
      )}

      {loginType === 'resetPassword' && step === 'login' && (
        <Button onClick={handleResetPassword} disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Code'}
        </Button>
      )}
    </div>
  );
}

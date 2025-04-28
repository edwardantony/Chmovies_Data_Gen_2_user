"use client";


import { useState, useEffect, useRef } from "react";
import { FaLock, FaEnvelope, FaCaretDown, FaUnlock, FaEyeSlash, FaEye } from "react-icons/fa";
import countries from "../../components/lib/countries";
import { useRouter } from "next/navigation";
import Footer from '../common/Footer';
//import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { toast } from 'react-hot-toast';
import {
  signIn,
  getCurrentUser,
  confirmSignIn,
  resetPassword,
  confirmResetPassword,
  fetchAuthSession,
} from 'aws-amplify/auth';
import '@/app/components/lib/auth/amplify-config';

interface CountryType {  
  name: string;
  iso_code: string;
  dial_code: string;
  flag: string;  
}

const SignIn = () => {
  const [identifier, setIdentifier] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isPhone, setIsPhone] = useState<boolean>(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPasswordLogin, setShowPasswordLogin] = useState<boolean>(true);
  const [showCountryList, setShowCountryList] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryType>(countries[2]);
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const [attempts, setAttempts] = useState(0);
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Handle click outside country dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCountryList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Countdown timer for OTP
  useEffect(() => {
    if (!otpSent || timer <= 0) return;

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [otpSent, timer]);

  useEffect(() => {
    if (otpInputs.current[0]) {
      otpInputs.current[0].focus();
    }
  }, [timer]);

  // Handle email/phone input change
  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d+$/.test(value)) {
      setIsPhone(true);
      setIdentifier(value);
    } else {
      setIsPhone(false);
      setIdentifier(value);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIdentifier(value);
  };

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input
    if (value && index < otp.length - 1) {
      otpInputs.current[index + 1]?.focus();
    }
  };

 
  // Handle Paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  
    // Extract and clean the pasted data
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, otp.length);
  
    // If no valid data is pasted, return early
    if (pastedData.length === 0) return;
  
    // Update the OTP state
    setOtp((prevOtp) => {
      const newOtp = [...prevOtp];
  
      // Distribute the pasted data across the OTP fields
      pastedData.split("").forEach((char, i) => {
        if (i < otp.length) newOtp[i] = char;
      });
  
      // Move focus to the last updated input field
      setTimeout(() => {
        const lastIndex = pastedData.length - 1;
        otpInputs.current[lastIndex < otp.length ? lastIndex : otp.length - 1]?.focus();
      }, 10);
  
      return newOtp;
    });
  };

  // Handle Backspace Key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  

  // Send OTP
  const sendOtp = () => {
    if (attempts < 5 && identifier) {
      setOtpSent(true);
      setTimer(60);
      setShowPasswordLogin(false);
      setAttempts((prev) => prev + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return minutes > 0 ? `${minutes}:${secs < 10 ? "0" : ""}${secs}` : `${secs}s`;
  };

  // Switch to password login
  const switchToPasswordLogin = () => {
    setOtpSent(false);
    setIdentifier("");
    setOtp(["", "", "", "", "", ""]);
    setTimer(0);
    setShowPasswordLogin(true);
  };

  // Switch to OTP login
  const switchToOtpLogin = () => {
    setShowPasswordLogin(false);
    setOtpSent(false);
  };

  // Select country code
  const selectCountryCode = (country: CountryType) => {
    setSelectedCountry(country);
    setShowCountryList(false);
  };

  // Switch to "Forgot Password" view
  const handleForgotPassword = () => {
    setForgotPassword(true);
  };

  // Back to login
  const handleBackToLogin = () => {
    setForgotPassword(false);
    setShowPasswordLogin(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!identifier) {
      toast.error('Please enter a valid email or phone number');
      setLoading(false);
      return;
    }
    try {
      if(showPasswordLogin) {
        const result = await signIn({ username:identifier, password });        
        if (result.isSignedIn) {  
          const user = await getCurrentUser();
          const updatedUser = { ...user, isLoggedIn: true };
          localStorage.setItem('userSession', JSON.stringify(updatedUser));       
          toast.success('Logged in successfully!');
          router.replace('/dashboard')
        } else if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
          const missing = result.nextStep?.missingAttributes || [];
          console.log('[Login] New password required. Missing:', missing);
          if (missing.includes('phone_number')) {
            toast.error('Phone number required. Switching to OTP login.');
          } else {
            toast('Password needs to be reset.');
          }
        } else if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE') {
          console.log('[Login] Custom OTP challenge triggered');
          toast.success('OTP challenge sent!');
        } else {
          toast.error('Login failed, please try again');
          console.log('[Login] Unhandled sign-in step:', result.nextStep);
        }
      }

    } catch (err: any) {
      console.error('Login Error: ', err);
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
        router.push("/dashboard");
    }
  }, [router]);


  return (
    <>
      <div className="flex flex-col justify-center items-center w-full min-h-screen bg-gray-900 text-gray-200">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-white flex items-center justify-center gap-2">
            {forgotPassword ? <FaUnlock className="text-white text-xl" /> : <FaLock className="text-white text-xl" />}
            {forgotPassword ? "Reset Password" : "Sign In"}
          </h2>

          <form className="mt-6">
            {forgotPassword ? (
              // Forgot Password Section
              <>
                <div className="mb-4">
                  <label className="block text-gray-400">Email</label>
                  <div className="flex items-center border border-gray-600 rounded-lg px-3 py-2 mt-1 bg-gray-700">
                    <FaEnvelope className="text-gray-400" />
                    <input
                      type="email"
                      className="w-full outline-none px-2 bg-gray-700 text-white"
                      placeholder="Enter your email"
                      value={identifier}
                      onChange={handleEmailChange}
                      required
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
                >
                  Reset Password
                </button>

                <div className="relative flex items-center my-4">
                  <div className="flex-grow border-t border-gray-600"></div>
                  <span className="mx-4 text-gray-400">Or</span>
                  <div className="flex-grow border-t border-gray-600"></div>
                </div>

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="mt-3 w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition"
                >
                  Back to SignIn
                </button>
              </>
            ) : (
              <>
                {/* OTP Message */}
                {otpSent && (
                  <p className="text-sm text-gray-400 mb-2">
                    We sent a sign-in code to{" "}
                    <span className="font-semibold text-white">
                      {isPhone ? `${selectedCountry.iso_code}${identifier}` : identifier}
                    </span>
                    . The code will expire in 15 minutes.
                  </p>
                )}

                {/* Email or Phone Input (Hidden after sending OTP) */}
                {!otpSent && (
                  <div className="mb-4 relative">
                    <div className="flex items-center border border-gray-600 rounded-lg px-3 py-2 mt-1 bg-gray-700">
                      {isPhone ? (
                        <div ref={dropdownRef} className="relative">
                          <button
                            type="button"
                            className="flex items-center text-white font-semibold mr-2 bg-gray-600 px-2 py-1 rounded-md hover:bg-gray-500"
                            onClick={() => setShowCountryList(!showCountryList)}
                          >
                            <span className="mr-1">{selectedCountry.flag}</span>
                            {selectedCountry.iso_code} <FaCaretDown className="ml-1" />
                          </button>

                          {showCountryList && (
                            <ul className="absolute bg-gray-700 border border-gray-600 w-40 mt-1 rounded-lg text-white max-h-40 overflow-auto shadow-lg z-10">
                              {countries.map((country, index) => (
                                <li
                                  key={index}
                                  onClick={() => selectCountryCode(country)}
                                  className="flex items-center px-3 py-2 hover:bg-gray-600 cursor-pointer"
                                >
                                  <span className="mr-2">{country.flag}</span>
                                  {country.dial_code} ({country.name})
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ) : (
                        <FaEnvelope className="text-gray-400" />
                      )}

                      <input
                        type="text"
                        className="w-full outline-none px-2 bg-gray-700 text-white"
                        placeholder={isPhone ? "Enter phone number" : "Enter email or phone"}
                        value={identifier}
                        onChange={handleIdentifierChange}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Password Input (Hidden in OTP Mode) */}
                {showPasswordLogin && !otpSent && (
                  <div className="mb-4">
                    <div className="flex items-center border border-gray-600 rounded-lg px-3 py-2 mt-1 bg-gray-700">
                      <FaLock className="text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full outline-none px-2 bg-gray-700 text-white"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 focus:outline-none"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                )}

                {/* OTP Input (Shown After Sending OTP) */}
                {otpSent && (
                  <div className="mb-4">
                    <label className="block text-gray-400 mb-2">Enter OTP</label>
                    <div className="flex justify-evenly gap-4">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => {otpInputs.current[index] = el;}}
                          type="text"
                          maxLength={1}
                          className="w-12 h-12 text-center text-xl font-bold bg-gray-700 text-white border border-gray-600 rounded-md outline-none"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onPaste={handlePaste}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Login & Send OTP Buttons */}
                {showPasswordLogin ? (
                  <>
                    <button
                      type="submit"
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
                      onClick={handleLogin}
                    >
                      Sign In
                    </button>
                    {attempts < 5 && (
                    <>
                    <div className="relative flex items-center my-4">
                      <div className="flex-grow border-t border-gray-600"></div>
                      <span className="mx-4 text-gray-400">Or</span>
                      <div className="flex-grow border-t border-gray-600"></div>
                    </div>

                    <Button
                      type="button"
                      onClick={switchToOtpLogin}
                      disabled={true}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition"
                    >
                      Sign In with OTP
                    </Button>
                    </>
                  )}
                  </>
                ) : (
                  <>
                    {!otpSent && (
                      <button
                        type="button"
                        onClick={sendOtp}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
                      >
                        Send Code
                      </button>
                    )}

                    {otpSent && (
                      <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
                      >
                        Verify SignIn Code
                      </button>
                    )}

                    {otpSent && (
                      <button
                        type="button"
                        onClick={sendOtp}
                        disabled={attempts >= 5 || timer > 0} 
                        className={`mt-3 px-4 py-2 rounded-lg w-full ${
                          attempts >= 5 || timer > 0 
                            ? "bg-gray-600 cursor-not-allowed" 
                            : "bg-blue-500 hover:bg-blue-600"
                        } text-white transition`}
                      >
                        {attempts < 5 && timer > 0
                          ? `Resend OTP in ${formatTime(timer)}`
                          : attempts < 5
                          ? "Resend OTP"
                          : "Try again later"
                        }

                      </button>
                    )}

                    <div className="relative flex items-center my-4">
                      <div className="flex-grow border-t border-gray-600"></div>
                      <span className="mx-4 text-gray-400">Or</span>
                      <div className="flex-grow border-t border-gray-600"></div>
                    </div>

                    <button
                      type="button"
                      onClick={switchToPasswordLogin}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition"
                    >
                      Sign In with Password
                    </button>
                  </>
                )}
                {showPasswordLogin && (
                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-blue-400 hover:underline text-sm"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                <div className="flex items-center mt-6 space-x-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="w-4 h-4 p-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-300 outline-none focus:outline-none focus:ring-0"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="rememberMe" className="text-sm text-gray-400 cursor-pointer select-none">
                    Remember Me
                  </label>
                </div>
              </>
            )}
          </form>
        </div>
        <Footer />
      </div>      
      
    </>
  );
};

export default SignIn;
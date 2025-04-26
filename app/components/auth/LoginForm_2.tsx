'use client'

import React, { useState } from 'react'
import { signIn, confirmSignIn } from 'aws-amplify/auth'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { toast } from 'react-hot-toast'
import '@/app/components/lib/auth/amplify-config'

type LoginMode = 'email-pass' | 'email-otp' | 'phone-otp'

export default function LoginPage() {
  const [mode, setMode] = useState<LoginMode>('email-pass')
  const [form, setForm] = useState({ email: '', password: '', phone: '', otp: '' })
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [userSession, setUserSession] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleLogin = async () => {
    setLoading(true)
    try {
      if (mode === 'email-pass') {
        if (!form.email || !form.password) {
          toast.error('Email and password required')
          return
        }
        await signIn({ username: form.email, password: form.password })
        toast.success('Logged in with email/password')
      }
  
      else if (mode === 'email-otp') {
        if (!form.email) {
          toast.error('Email required for OTP login')
          return
        }
        const user = await signIn({ username: form.email })
        setUserSession(user)
        setShowOtpInput(true)
        toast.success('OTP sent to email')
      }
  
      else if (mode === 'phone-otp') {
        if (!form.phone) {
          toast.error('Phone number required for OTP login')
          return
        }
        const user = await signIn({ username: form.phone }) // no password!
        setUserSession(user)
        setShowOtpInput(true)
        toast.success('OTP sent to phone')
      }
    } catch (err: any) {
      toast.error(err.message || 'Login failed')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmOtp = async () => {
    setLoading(true)
    try {
      if (!form.otp) {
        toast.error('Please enter the OTP')
        return
      }
      await confirmSignIn({ challengeResponse: form.otp })
      toast.success('OTP verified, logged in!')
      setShowOtpInput(false)
    } catch (err: any) {
      toast.error('Invalid OTP or session expired')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-6 bg-white rounded shadow-md w-full max-w-md space-y-4">
        <div className="flex justify-between mb-4">
          {(['email-pass', 'email-otp', 'phone-otp'] as LoginMode[]).map((m) => (
            <Button
              key={m}
              variant={mode === m ? 'primary' : 'ghost'}
              onClick={() => {
                setMode(m)
                setShowOtpInput(false)
                setForm({ email: '', password: '', phone: '', otp: '' })
              }}
              className="w-full"
            >
              {m.replace('-', ' ').toUpperCase()}
            </Button>
          ))}
        </div>

        {!showOtpInput ? (
          <>
            {mode === 'email-pass' && (
              <>
                <Input label='' name="email" type="email" placeholder="Email" onChange={handleChange} />
                <Input label='' name="password" type="password" placeholder="Password" onChange={handleChange} />
              </>
            )}
            {mode === 'email-otp' && (
              <Input label='' name="email" type="email" placeholder="Email for OTP" onChange={handleChange} />
            )}
            {mode === 'phone-otp' && (
              <Input label='' name="phone" type="tel" placeholder="Phone Number" onChange={handleChange} />
            )}
            <Button className="w-full mt-4" onClick={handleLogin} disabled={loading}>
              {loading ? 'Processing...' : 'Login'}
            </Button>
          </>
        ) : (
          <>
            <Input name="otp" label='' type="text" placeholder="Enter OTP" onChange={handleChange} />
            <Button className="w-full mt-4" onClick={handleConfirmOtp} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import { signUp, confirmSignUp } from 'aws-amplify/auth'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { toast } from 'react-hot-toast'
import '@/app/components/lib/auth/amplify-config'

type SignUpMode = 'email-pass' | 'email-otp' | 'phone-otp'

export default function SignUpPage() {
  const [mode, setMode] = useState<SignUpMode>('email-pass')
  const [form, setForm] = useState({ email: '', password: '', phone: '', code: '' })
  const [step, setStep] = useState<'form' | 'verify'>('form')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSignUp = async () => {
    setLoading(true)
    try {
      let inputUsername = ''
      let options: any = { userAttributes: {} }

      if (mode === 'email-pass') {
        if (!form.email || !form.password) {
          toast.error('Email and password required')
          return
        }
        inputUsername = form.email
        options.userAttributes.email = form.email
        await signUp({ username: inputUsername, password: form.password, options })
      }

      else if (mode === 'email-otp') {
        if (!form.email) {
          toast.error('Email required')
          return
        }
        inputUsername = form.email
        options.userAttributes.email = form.email
        await signUp({ username: inputUsername, options })
      }

      else if (mode === 'phone-otp') {
        if (!form.phone) {
          toast.error('Phone number required')
          return
        }
        inputUsername = form.phone
        options.userAttributes.phone_number = form.phone
        await signUp({ username: inputUsername, options })
      }

      setUsername(inputUsername)
      setStep('verify')
      toast.success('Verification code sent')
    } catch (err: any) {
      toast.error(err.message || 'Signup failed')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    setLoading(true)
    try {
      await confirmSignUp({ username, confirmationCode: form.code })
      toast.success('Signup confirmed! You can now log in.')
      setStep('form')
      setForm({ email: '', password: '', phone: '', code: '' })
    } catch (err: any) {
      toast.error('Invalid code or expired')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-6 bg-white rounded shadow-md w-full max-w-md space-y-4">
        <div className="flex justify-between mb-4">
          {(['email-pass', 'email-otp', 'phone-otp'] as SignUpMode[]).map((m) => (
            <Button
              key={m}
              variant={mode === m ? 'primary' : 'ghost'}
              onClick={() => {
                setMode(m)
                setForm({ email: '', password: '', phone: '', code: '' })
                setStep('form')
              }}
              className="w-full"
            >
              {m.replace('-', ' ').toUpperCase()}
            </Button>
          ))}
        </div>

        {step === 'form' ? (
          <>
            {mode === 'email-pass' && (
              <>
                <Input label='' name="email" type="email" placeholder="Email" onChange={handleChange} />
                <Input label='' name="password" type="password" placeholder="Password" onChange={handleChange} />
              </>
            )}
            {mode === 'email-otp' && (
              <Input label='' name="email" type="email" placeholder="Email" onChange={handleChange} />
            )}
            {mode === 'phone-otp' && (
              <Input label='' name="phone" type="tel" placeholder="Phone Number (+1...)" onChange={handleChange} />
            )}
            <Button className="w-full mt-4" onClick={handleSignUp} disabled={loading}>
              {loading ? 'Registering...' : 'Sign Up'}
            </Button>
          </>
        ) : (
          <>
            <Input label='' name="code" type="text" placeholder="Enter verification code" onChange={handleChange} />
            <Button className="w-full mt-4" onClick={handleVerify} disabled={loading}>
              {loading ? 'Verifying...' : 'Confirm Signup'}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

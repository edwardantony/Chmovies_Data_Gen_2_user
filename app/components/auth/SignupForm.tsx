'use client'

import React, { useState } from 'react'
import { signUp, confirmSignUp } from 'aws-amplify/auth'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { toast } from 'react-hot-toast'
import '@/app/components/lib/auth/amplify-config'

export default function SignUpPage() {
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
      const { email, password, phone } = form
      if (!email || !password) {
        toast.error('Email, password, and phone are required')
        return
      }

      const inputUsername = email
      await signUp({
        username: inputUsername,
        password,
        options: {
          userAttributes: {
            email,
            phone_number: phone, // must be in E.164 format like "+1234567890"
          },
        },
      })

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
      toast.error('Invalid or expired code')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-6 bg-white rounded shadow-md w-full max-w-md space-y-4">
        {step === 'form' ? (
          <>
            <Input label='' name="email" type="email" placeholder="Email" onChange={handleChange} />
            <Input label='' name="password" type="password" placeholder="Password" onChange={handleChange} />
            <Input label='' name="phone" type="tel" placeholder="Phone Number (+123...)" onChange={handleChange} />
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

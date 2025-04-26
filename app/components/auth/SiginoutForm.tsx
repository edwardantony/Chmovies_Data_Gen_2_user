'use client';

import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import '@/app/components/lib/auth/amplify-config';

export default function signout() {
  const router = useRouter();
  const [status, setStatus] = useState<'logging-out' | 'error' | 'success'>('logging-out');

  const performLogout = async () => {
    try {
      // Clear client-side data first
      localStorage.removeItem('authSession');
      sessionStorage.clear();

      await signOut({ global: true });

      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.split('=');
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });

      setStatus('success');
      
      // Redirect first, then show success toast slightly delayed
      router.replace('/signin');
      setTimeout(() => {
        toast.success('Logged out successfully');
      }, 200);

    } catch (error) {
      console.error('Logout error:', error);
      setStatus('error');
      toast.error('Logout failed. Please try again.');
      
      setTimeout(() => router.replace('/signin'), 3000);
    }
  };

  useEffect(() => {
    performLogout();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center p-8 rounded-lg bg-gray-800 max-w-md w-full">
        {status === 'logging-out' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white text-lg">Logging out...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-red-500 text-4xl mb-4">✕</div>
            <p className="text-white text-lg">Logout failed</p>
            <p className="text-gray-400 mt-2">Redirecting to login page...</p>
          </>
        )}
      </div>
    </div>
  );
}

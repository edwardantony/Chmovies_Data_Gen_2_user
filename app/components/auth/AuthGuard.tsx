'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from 'aws-amplify/auth';
import LoadingSpinner from '../ui/LoadingSpinner';
import '@/app/components/lib/amplify-client';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getCurrentUser();
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication check failed:', error);
        router.replace('/signin');
      }
    };

    checkAuth();
  }, [router]);

  if (!isAuthenticated) {
    return <LoadingSpinner fullScreen />;
  }

  return <>{children}</>;
}
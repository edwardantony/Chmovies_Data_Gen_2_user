// app/dashboard/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

// Disable SSR for AuthGuard since it uses browser APIs
const AuthGuard = dynamic(() => import('@/app/components/auth/AuthGuard'), { 
  loading: () => <LoadingSpinner fullScreen />
  }
);

export default function Dashboard() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <AuthGuard>
        <div className="p-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
      </AuthGuard>
    </Suspense>
  );
}
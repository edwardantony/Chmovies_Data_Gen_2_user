'use client';

import { signOut } from 'aws-amplify/auth';
import { Button } from '../ui/Button';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return <Button onClick={handleLogout}>Logout</Button>;
}

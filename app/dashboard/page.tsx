import LogoutButton from '@/app/components/auth/LogoutButton';

export default function DashboardPage() {
  return (
    <div className="p-8 text-white bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Welcome to Dashboard</h1>
      <LogoutButton />
    </div>
  );
}
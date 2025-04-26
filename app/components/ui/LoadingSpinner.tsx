'use client';

type LoadingSpinnerProps = {
  fullScreen?: boolean;
  className?: string;
};

export default function LoadingSpinner({ fullScreen = false, className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`${fullScreen ? 'h-screen w-screen' : 'h-full w-full'} flex items-center justify-center ${className}`}>
      <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500" />
    </div>
  );
}

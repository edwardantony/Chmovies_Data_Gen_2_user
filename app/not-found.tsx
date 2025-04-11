// app/not-found.tsx
"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <h1 className="text-4xl font-bold mb-4">404 – Page Not Found</h1>
      <p className="mb-6 text-gray-400 text-center">
        The page you're looking for doesn't exist.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
      >
        Go Home
      </Link>
    </div>
  );
}

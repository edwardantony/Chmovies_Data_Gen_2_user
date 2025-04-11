// components/ui/Input.tsx
import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export const Input: React.FC<Props> = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium text-white">{label}</label>
    <input {...props} className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none" />
  </div>
);

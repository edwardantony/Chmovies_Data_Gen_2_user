// components/ui/Button.tsx
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
    <button {...props} className="w-full py-3 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold">
      {children}
    </button>
  );
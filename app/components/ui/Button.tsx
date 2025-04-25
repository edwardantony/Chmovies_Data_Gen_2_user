import React from 'react'
import clsx from 'clsx'

type ButtonVariant = 'primary' | 'ghost' | 'danger'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseClasses = 'w-full py-3 px-4 rounded font-semibold transition duration-200'

  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    ghost: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  }

  return (
    <button
      {...props}
      className={clsx(baseClasses, variantClasses[variant], className)}
    >
      {children}
    </button>
  )
}

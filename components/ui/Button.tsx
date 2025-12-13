import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

/**
 * Reusable Button component with variants and sizes
 */
export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        // Base styles
        'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',

        // Variant styles
        {
          'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600':
            variant === 'primary',
          'bg-zinc-200 text-zinc-900 hover:bg-zinc-300 focus-visible:ring-zinc-500 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600':
            variant === 'secondary',
          'bg-transparent text-zinc-700 hover:bg-zinc-100 focus-visible:ring-zinc-500 dark:text-zinc-300 dark:hover:bg-zinc-800':
            variant === 'ghost',
          'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600':
            variant === 'danger'
        },

        // Size styles
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg'
        },

        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

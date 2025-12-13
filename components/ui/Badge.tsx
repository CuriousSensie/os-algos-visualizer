import { ReactNode, HTMLAttributes } from 'react';
import clsx from 'clsx';
import type { ActionType } from '@/types/visualization';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: ActionType | 'default';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Reusable Badge component for status indicators
 */
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',

        // Variant styles (matching algorithm state colors)
        {
          'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300': variant === 'default',
          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': variant === 'success',
          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': variant === 'error',
          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400': variant === 'warning',
          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400': variant === 'active',
          'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400': variant === 'neutral'
        },

        // Size styles
        {
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-2.5 py-1 text-sm': size === 'md',
          'px-3 py-1.5 text-base': size === 'lg'
        },

        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

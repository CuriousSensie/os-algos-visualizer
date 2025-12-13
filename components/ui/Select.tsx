import { SelectHTMLAttributes, ReactNode, forwardRef } from 'react';
import clsx from 'clsx';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

/**
 * Reusable Select component for dropdowns
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, id, children, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substring(7)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            'w-full px-4 py-2 rounded-lg border transition-colors',
            'bg-white dark:bg-zinc-900',
            'text-zinc-900 dark:text-zinc-100',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            {
              'border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:ring-blue-500':
                !error,
              'border-red-500 focus:border-red-500 focus:ring-red-500': error
            },
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'appearance-none bg-[length:1.5em] bg-[right_0.5rem_center] bg-no-repeat',
            'bg-[url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")]',
            'pr-10',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

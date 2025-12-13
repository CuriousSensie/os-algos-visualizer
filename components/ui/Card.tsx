import { ReactNode, HTMLAttributes } from 'react';
import clsx from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'bordered' | 'elevated';
}

/**
 * Reusable Card component for content sections
 */
export function Card({
  children,
  variant = 'default',
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl',
        {
          'bg-zinc-50 dark:bg-zinc-900': variant === 'default',
          'bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800': variant === 'bordered',
          'bg-zinc-50 dark:bg-zinc-900 shadow-lg': variant === 'elevated'
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card Header component
 */
export function CardHeader({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx('p-6 border-b border-zinc-200 dark:border-zinc-800', className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card Content component
 */
export function CardContent({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('p-6', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Card Title component
 */
export function CardTitle({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={clsx('text-xl font-semibold text-zinc-900 dark:text-zinc-100', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

/**
 * Card Description component
 */
export function CardDescription({ children, className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={clsx('text-sm text-zinc-600 dark:text-zinc-400 mt-1', className)}
      {...props}
    >
      {children}
    </p>
  );
}

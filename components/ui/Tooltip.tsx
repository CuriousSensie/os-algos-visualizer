'use client';

import { ReactNode, useState } from 'react';
import clsx from 'clsx';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Simple Tooltip component for educational hints
 */
export function Tooltip({ children, content, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && content && (
        <div
          className={clsx(
            'absolute z-50 px-3 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-700',
            'rounded-lg shadow-lg whitespace-nowrap pointer-events-none',
            {
              'bottom-full left-1/2 -translate-x-1/2 -translate-y-2': position === 'top',
              'top-full left-1/2 -translate-x-1/2 translate-y-2': position === 'bottom',
              'right-full top-1/2 -translate-x-2 -translate-y-1/2': position === 'left',
              'left-full top-1/2 translate-x-2 -translate-y-1/2': position === 'right'
            }
          )}
          role="tooltip"
        >
          {content}
          {/* Tooltip arrow */}
          <div
            className={clsx(
              'absolute w-2 h-2 bg-zinc-900 dark:bg-zinc-700 rotate-45',
              {
                'bottom-[-4px] left-1/2 -translate-x-1/2': position === 'top',
                'top-[-4px] left-1/2 -translate-x-1/2': position === 'bottom',
                'right-[-4px] top-1/2 -translate-y-1/2': position === 'left',
                'left-[-4px] top-1/2 -translate-y-1/2': position === 'right'
              }
            )}
          />
        </div>
      )}
    </div>
  );
}

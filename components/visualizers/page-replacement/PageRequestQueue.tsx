'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';

interface PageRequestQueueProps {
  pageRequests: number[];
  currentIndex: number;
  className?: string;
}

/**
 * Displays the page request queue with current page highlighted
 */
export function PageRequestQueue({
  pageRequests,
  currentIndex,
  className
}: PageRequestQueueProps) {
  return (
    <div className={className}>
      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
        Page Reference String
      </h3>
      <div className="flex flex-wrap gap-2">
        {pageRequests.map((page, index) => (
          <motion.div
            key={index}
            className={clsx(
              'w-12 h-12 rounded-lg border-2 flex items-center justify-center',
              'font-semibold transition-all duration-200',
              {
                'border-blue-500 bg-blue-500 text-white scale-110': index === currentIndex,
                'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100':
                  index > currentIndex,
                'border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500':
                  index < currentIndex
              }
            )}
            animate={{
              scale: index === currentIndex ? 1.1 : 1
            }}
          >
            {page}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

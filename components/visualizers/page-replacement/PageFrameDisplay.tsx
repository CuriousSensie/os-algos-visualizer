'use client';

import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface PageFrameDisplayProps {
  frames: (number | null)[];
  highlightIndex?: number;
  action?: 'hit' | 'miss' | 'replace';
  className?: string;
}

/**
 * Displays memory frames with animations
 */
export function PageFrameDisplay({
  frames,
  highlightIndex,
  action,
  className
}: PageFrameDisplayProps) {
  return (
    <div className={clsx('flex flex-wrap gap-4 justify-center', className)}>
      {frames.map((page, index) => (
        <motion.div
          key={index}
          className={clsx(
            'relative w-24 h-24 rounded-lg border-2 flex items-center justify-center',
            'transition-all duration-300',
            {
              'border-green-500 bg-green-50 dark:bg-green-900/20':
                index === highlightIndex && action === 'hit',
              'border-red-500 bg-red-50 dark:bg-red-900/20':
                index === highlightIndex && (action === 'miss' || action === 'replace'),
              'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900':
                index !== highlightIndex
            }
          )}
          animate={{
            scale: index === highlightIndex ? 1.05 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          {/* Frame label */}
          <div className="absolute -top-3 left-2 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Frame {index}
          </div>

          {/* Page content */}
          <AnimatePresence mode="wait">
            {page !== null ? (
              <motion.div
                key={`page-${page}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
                className="text-3xl font-bold text-zinc-900 dark:text-zinc-100"
              >
                {page}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-2xl text-zinc-400 dark:text-zinc-600"
              >
                —
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';

interface DiskTrackProps {
  diskSize: number;
  seekSequence: number[];
  currentStep: number;
  initialPosition: number;
  className?: string;
}

/**
 * Disk track visualization with head movement
 */
export function DiskTrack({
  diskSize,
  seekSequence,
  currentStep,
  initialPosition,
  className
}: DiskTrackProps) {
  const scale = 800 / diskSize; // 800px total width
  const currentPosition = seekSequence[Math.min(currentStep, seekSequence.length - 1)];

  return (
    <div className={className}>
      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
        Disk Head Movement
      </h3>

      <div className="relative h-32 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4">
        {/* Track line */}
        <div className="absolute top-1/2 left-4 right-4 h-1 bg-zinc-300 dark:bg-zinc-700 -translate-y-1/2" />

        {/* Track labels */}
        <div className="absolute top-1/2 left-4 right-4 flex justify-between -translate-y-1/2">
          {[0, Math.floor(diskSize / 4), Math.floor(diskSize / 2), Math.floor((3 * diskSize) / 4), diskSize - 1].map(track => (
            <div key={track} className="flex flex-col items-center">
              <div className="w-px h-4 bg-zinc-400 dark:bg-zinc-600 mb-1" />
              <span className="text-xs text-zinc-600 dark:text-zinc-400">{track}</span>
            </div>
          ))}
        </div>

        {/* Request tracks */}
        {seekSequence.slice(1).map((track, index) => {
          const isServiced = index < currentStep;
          return (
            <motion.div
              key={index}
              className={`absolute top-1/2 w-3 h-3 rounded-full -translate-y-1/2 ${
                isServiced ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ left: `${4 + (track / (diskSize - 1)) * (100 - 8)}%` }}
              initial={{ scale: 0 }}
              animate={{ scale: isServiced ? 1 : 0.7 }}
              transition={{ duration: 0.3 }}
            />
          );
        })}

        {/* Disk head */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
          animate={{ left: `${4 + (currentPosition / (diskSize - 1)) * (100 - 8)}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-red-500" />
          <div className="text-xs font-bold text-red-600 dark:text-red-400 mt-10">
            {currentPosition}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

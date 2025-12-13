'use client';

import { motion } from 'framer-motion';
import { getProcessColor } from '@/lib/utils/color-schemes';
import type { GanttSegment } from '@/lib/algorithms/cpu-scheduling/types';

interface GanttChartProps {
  ganttChart: GanttSegment[];
  currentTime: number;
  className?: string;
}

/**
 * Gantt Chart visualization for CPU scheduling
 */
export function GanttChart({ ganttChart, currentTime, className }: GanttChartProps) {
  if (ganttChart.length === 0) return null;

  const maxTime = Math.max(...ganttChart.map(g => g.endTime));
  const scale = 40; // pixels per time unit

  return (
    <div className={className}>
      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
        Gantt Chart
      </h3>

      <div className="relative overflow-x-auto pb-4">
        <div style={{ width: `${maxTime * scale}px`, minWidth: '100%' }} className="relative h-20">
          {/* Time axis */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-zinc-300 dark:bg-zinc-700" />
          {Array.from({ length: maxTime + 1 }, (_, i) => (
            <div
              key={i}
              className="absolute bottom-0 flex flex-col items-center"
              style={{ left: `${i * scale}px` }}
            >
              <div className="w-px h-2 bg-zinc-300 dark:bg-zinc-700" />
              <span className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{i}</span>
            </div>
          ))}

          {/* Gantt segments */}
          {ganttChart.map((segment, index) => (
            <motion.div
              key={index}
              className="absolute top-0 h-16 flex items-center justify-center rounded border-2 border-white dark:border-zinc-900"
              style={{
                left: `${segment.startTime * scale}px`,
                width: `${(segment.endTime - segment.startTime) * scale}px`,
                opacity: segment.endTime <= currentTime ? 1 : 0.4
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className={`w-full h-full ${getProcessColor(segment.processId - 1)} flex items-center justify-center rounded`}>
                <span className="text-sm font-semibold text-white">
                  {segment.processName}
                </span>
              </div>
            </motion.div>
          ))}

          {/* Current time indicator */}
          <motion.div
            className="absolute top-0 bottom-0 w-0.5 bg-blue-500"
            style={{ left: `${currentTime * scale}px` }}
            animate={{ left: `${currentTime * scale}px` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>
    </div>
  );
}

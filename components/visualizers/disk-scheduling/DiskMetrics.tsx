import { MetricsPanel } from '../shared/MetricsPanel';
import type { DiskSchedulingResult } from '@/lib/algorithms/disk-scheduling/types';

interface DiskMetricsProps {
  result: DiskSchedulingResult;
  className?: string;
}

/**
 * Displays metrics for disk scheduling algorithms
 */
export function DiskMetrics({ result, className }: DiskMetricsProps) {
  const metrics = [
    {
      label: 'Total Seek Time',
      value: result.totalSeekTime,
      variant: 'error' as const
    },
    {
      label: 'Average Seek Time',
      value: result.averageSeekTime.toFixed(2),
      variant: 'warning' as const
    },
    {
      label: 'Requests Served',
      value: result.seekSequence.length - 1,
      variant: 'success' as const
    }
  ];

  return <MetricsPanel title="Disk Scheduling Metrics" metrics={metrics} className={className} />;
}

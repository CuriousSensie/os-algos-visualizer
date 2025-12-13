import { MetricsPanel } from '../shared/MetricsPanel';
import type { SchedulingResult } from '@/lib/algorithms/cpu-scheduling/types';

interface SchedulingMetricsProps {
  result: SchedulingResult;
  className?: string;
}

/**
 * Displays metrics specific to CPU scheduling algorithms
 */
export function SchedulingMetrics({ result, className }: SchedulingMetricsProps) {
  const metrics = [
    {
      label: 'Avg Waiting Time',
      value: result.averageWaitingTime.toFixed(2),
      variant: 'warning' as const
    },
    {
      label: 'Avg Turnaround Time',
      value: result.averageTurnaroundTime.toFixed(2),
      variant: 'active' as const
    },
    {
      label: 'Avg Response Time',
      value: result.averageResponseTime.toFixed(2),
      variant: 'neutral' as const
    },
    {
      label: 'CPU Utilization',
      value: `${result.cpuUtilization.toFixed(2)}%`,
      variant: 'success' as const
    },
    {
      label: 'Total Time',
      value: result.totalTime,
      variant: 'active' as const
    }
  ];

  return <MetricsPanel title="Scheduling Metrics" metrics={metrics} className={className} />;
}

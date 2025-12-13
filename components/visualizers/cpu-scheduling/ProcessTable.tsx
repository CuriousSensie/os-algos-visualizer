import { getProcessColor } from '@/lib/utils/color-schemes';
import type { ProcessMetrics } from '@/lib/algorithms/cpu-scheduling/types';

interface ProcessTableProps {
  processMetrics: ProcessMetrics[];
  className?: string;
}

/**
 * Process metrics table for CPU scheduling
 */
export function ProcessTable({ processMetrics, className }: ProcessTableProps) {
  return (
    <div className={className}>
      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
        Process Metrics
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg">
          <thead className="bg-zinc-100 dark:bg-zinc-800">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-zinc-700 dark:text-zinc-300">Process</th>
              <th className="px-4 py-2 text-left font-medium text-zinc-700 dark:text-zinc-300">AT</th>
              <th className="px-4 py-2 text-left font-medium text-zinc-700 dark:text-zinc-300">BT</th>
              <th className="px-4 py-2 text-left font-medium text-zinc-700 dark:text-zinc-300">CT</th>
              <th className="px-4 py-2 text-left font-medium text-zinc-700 dark:text-zinc-300">TAT</th>
              <th className="px-4 py-2 text-left font-medium text-zinc-700 dark:text-zinc-300">WT</th>
              <th className="px-4 py-2 text-left font-medium text-zinc-700 dark:text-zinc-300">RT</th>
            </tr>
          </thead>
          <tbody>
            {processMetrics.map((metric) => (
              <tr key={metric.processId} className="border-t border-zinc-200 dark:border-zinc-800">
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${getProcessColor(metric.processId - 1)}`} />
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      {metric.processName}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2 text-zinc-700 dark:text-zinc-300">{metric.arrivalTime}</td>
                <td className="px-4 py-2 text-zinc-700 dark:text-zinc-300">{metric.burstTime}</td>
                <td className="px-4 py-2 text-zinc-700 dark:text-zinc-300">{metric.completionTime}</td>
                <td className="px-4 py-2 text-zinc-700 dark:text-zinc-300">{metric.turnaroundTime}</td>
                <td className="px-4 py-2 text-zinc-700 dark:text-zinc-300">{metric.waitingTime}</td>
                <td className="px-4 py-2 text-zinc-700 dark:text-zinc-300">{metric.responseTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
        AT: Arrival Time, BT: Burst Time, CT: Completion Time, TAT: Turnaround Time, WT: Waiting Time, RT: Response Time
      </div>
    </div>
  );
}

'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type {
  PageReplacementComparison,
  CPUSchedulingComparison,
  DiskSchedulingComparison,
  AlgorithmCategory,
} from '@/lib/utils/comparison';
import {
  findBestPageReplacementAlgorithm,
  findBestCPUSchedulingAlgorithm,
  findBestDiskSchedulingAlgorithm,
} from '@/lib/utils/comparison';
import { Trophy } from 'lucide-react';

interface ComparisonMetricsProps {
  category: AlgorithmCategory;
  metrics:
    | PageReplacementComparison[]
    | CPUSchedulingComparison[]
    | DiskSchedulingComparison[];
}

export function ComparisonMetrics({ category, metrics }: ComparisonMetricsProps) {
  let bestAlgorithm: string;

  if (category === 'page-replacement') {
    bestAlgorithm = findBestPageReplacementAlgorithm(
      metrics as PageReplacementComparison[]
    );
  } else if (category === 'cpu-scheduling') {
    bestAlgorithm = findBestCPUSchedulingAlgorithm(metrics as CPUSchedulingComparison[]);
  } else {
    bestAlgorithm = findBestDiskSchedulingAlgorithm(
      metrics as DiskSchedulingComparison[]
    );
  }

  return (
    <Card variant="bordered">
      <CardHeader>
        <CardTitle>Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {category === 'page-replacement' && (
            <PageReplacementTable
              metrics={metrics as PageReplacementComparison[]}
              bestAlgorithm={bestAlgorithm}
            />
          )}
          {category === 'cpu-scheduling' && (
            <CPUSchedulingTable
              metrics={metrics as CPUSchedulingComparison[]}
              bestAlgorithm={bestAlgorithm}
            />
          )}
          {category === 'disk-scheduling' && (
            <DiskSchedulingTable
              metrics={metrics as DiskSchedulingComparison[]}
              bestAlgorithm={bestAlgorithm}
            />
          )}
        </div>

        {/* Best Algorithm Badge */}
        <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Best Performing Algorithm:
            </span>
            <Badge variant="success" className="font-semibold">
              {bestAlgorithm}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PageReplacementTable({
  metrics,
  bestAlgorithm,
}: {
  metrics: PageReplacementComparison[];
  bestAlgorithm: string;
}) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-zinc-200 dark:border-zinc-700">
          <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Algorithm
          </th>
          <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Page Faults
          </th>
          <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Page Hits
          </th>
          <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Hit Ratio
          </th>
          <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Miss Ratio
          </th>
        </tr>
      </thead>
      <tbody>
        {metrics.map((metric, index) => {
          const isBest = metric.algorithmName === bestAlgorithm;
          return (
            <tr
              key={metric.algorithmName}
              className={`border-b border-zinc-100 dark:border-zinc-800 ${
                isBest ? 'bg-green-50 dark:bg-green-950/20' : ''
              }`}
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {metric.algorithmName}
                  </span>
                  {isBest && <Trophy className="w-4 h-4 text-yellow-500" />}
                </div>
              </td>
              <td className="text-right py-3 px-4 text-zinc-700 dark:text-zinc-300">
                {metric.totalPageFaults}
              </td>
              <td className="text-right py-3 px-4 text-zinc-700 dark:text-zinc-300">
                {metric.totalHits}
              </td>
              <td className="text-right py-3 px-4 text-zinc-700 dark:text-zinc-300">
                {(metric.hitRatio * 100).toFixed(2)}%
              </td>
              <td className="text-right py-3 px-4 text-zinc-700 dark:text-zinc-300">
                {(metric.missRatio * 100).toFixed(2)}%
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function CPUSchedulingTable({
  metrics,
  bestAlgorithm,
}: {
  metrics: CPUSchedulingComparison[];
  bestAlgorithm: string;
}) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-zinc-200 dark:border-zinc-700">
          <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Algorithm
          </th>
          <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Avg Waiting Time
          </th>
          <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Avg Turnaround Time
          </th>
          <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Avg Response Time
          </th>
          <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Completion Time
          </th>
        </tr>
      </thead>
      <tbody>
        {metrics.map((metric) => {
          const isBest = metric.algorithmName === bestAlgorithm;
          return (
            <tr
              key={metric.algorithmName}
              className={`border-b border-zinc-100 dark:border-zinc-800 ${
                isBest ? 'bg-green-50 dark:bg-green-950/20' : ''
              }`}
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {metric.algorithmName}
                  </span>
                  {isBest && <Trophy className="w-4 h-4 text-yellow-500" />}
                </div>
              </td>
              <td className="text-right py-3 px-4 text-zinc-700 dark:text-zinc-300">
                {metric.averageWaitingTime}
              </td>
              <td className="text-right py-3 px-4 text-zinc-700 dark:text-zinc-300">
                {metric.averageTurnaroundTime}
              </td>
              <td className="text-right py-3 px-4 text-zinc-700 dark:text-zinc-300">
                {metric.averageResponseTime}
              </td>
              <td className="text-right py-3 px-4 text-zinc-700 dark:text-zinc-300">
                {metric.totalCompletionTime}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function DiskSchedulingTable({
  metrics,
  bestAlgorithm,
}: {
  metrics: DiskSchedulingComparison[];
  bestAlgorithm: string;
}) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-zinc-200 dark:border-zinc-700">
          <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Algorithm
          </th>
          <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Total Seek Time
          </th>
          <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Average Seek Time
          </th>
          <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Requests Serviced
          </th>
        </tr>
      </thead>
      <tbody>
        {metrics.map((metric) => {
          const isBest = metric.algorithmName === bestAlgorithm;
          return (
            <tr
              key={metric.algorithmName}
              className={`border-b border-zinc-100 dark:border-zinc-800 ${
                isBest ? 'bg-green-50 dark:bg-green-950/20' : ''
              }`}
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {metric.algorithmName}
                  </span>
                  {isBest && <Trophy className="w-4 h-4 text-yellow-500" />}
                </div>
              </td>
              <td className="text-right py-3 px-4 text-zinc-700 dark:text-zinc-300">
                {metric.totalSeekTime}
              </td>
              <td className="text-right py-3 px-4 text-zinc-700 dark:text-zinc-300">
                {metric.averageSeekTime.toFixed(2)}
              </td>
              <td className="text-right py-3 px-4 text-zinc-700 dark:text-zinc-300">
                {metric.totalRequests}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

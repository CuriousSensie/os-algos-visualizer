import { MetricsPanel } from '../shared/MetricsPanel';
import type { PageReplacementResult } from '@/lib/algorithms/page-replacement/types';

interface PageReplacementMetricsProps {
  result: PageReplacementResult;
  className?: string;
}

/**
 * Displays metrics specific to page replacement algorithms
 */
export function PageReplacementMetrics({ result, className }: PageReplacementMetricsProps) {
  const metrics = [
    {
      label: 'Total Page Faults',
      value: result.totalPageFaults,
      variant: 'error' as const
    },
    {
      label: 'Total Page Hits',
      value: result.totalHits,
      variant: 'success' as const
    },
    {
      label: 'Hit Ratio',
      value: `${(result.hitRatio * 100).toFixed(2)}%`,
      variant: 'success' as const
    },
    {
      label: 'Miss Ratio',
      value: `${(result.missRatio * 100).toFixed(2)}%`,
      variant: 'error' as const
    }
  ];

  return <MetricsPanel title="Page Replacement Metrics" metrics={metrics} className={className} />;
}

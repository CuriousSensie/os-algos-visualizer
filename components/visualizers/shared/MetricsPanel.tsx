import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Metric {
  label: string;
  value: string | number;
  variant?: 'success' | 'error' | 'warning' | 'active' | 'neutral' | 'default';
}

interface MetricsPanelProps {
  title?: string;
  metrics: Metric[];
  className?: string;
}

/**
 * Metrics display panel for algorithm results
 */
export function MetricsPanel({ title = 'Metrics', metrics, className }: MetricsPanelProps) {
  return (
    <Card variant="bordered" className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {metric.label}
              </span>
              {metric.variant ? (
                <Badge variant={metric.variant} size="md">
                  {metric.value}
                </Badge>
              ) : (
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {metric.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

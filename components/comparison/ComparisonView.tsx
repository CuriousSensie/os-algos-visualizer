'use client';

import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAnimationControl } from '@/hooks/useAnimationControl';
import { ControlPanel } from '@/components/visualizers/shared/ControlPanel';
import { SpeedControl } from '@/components/visualizers/shared/SpeedControl';
import type { AlgorithmCategory } from '@/lib/utils/comparison';

// Page Replacement
import { PageFrameDisplay } from '@/components/visualizers/page-replacement/PageFrameDisplay';
import type { PageReplacementResult } from '@/lib/algorithms/page-replacement/types';

// CPU Scheduling
import { GanttChart } from '@/components/visualizers/cpu-scheduling/GanttChart';
import type { SchedulingResult } from '@/lib/algorithms/cpu-scheduling/types';

// Disk Scheduling
import { DiskTrack } from '@/components/visualizers/disk-scheduling/DiskTrack';
import type { DiskSchedulingResult } from '@/lib/algorithms/disk-scheduling/types';

interface ComparisonViewProps {
  category: AlgorithmCategory;
  results: Map<
    string,
    PageReplacementResult | SchedulingResult | DiskSchedulingResult
  >;
  inputs: Record<string, unknown>;
}

export function ComparisonView({ category, results, inputs }: ComparisonViewProps) {
  // Find the maximum number of steps across all results
  const maxSteps = useMemo(() => {
    return Math.max(...Array.from(results.values()).map((result) => result.steps.length));
  }, [results]);

  const animation = useAnimationControl(maxSteps);

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card variant="bordered">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <ControlPanel {...animation} />
            <SpeedControl speed={animation.speed} setSpeed={animation.setSpeed} />
          </div>
        </CardContent>
      </Card>

      {/* Side-by-Side Visualizations */}
      <div
        className={`grid gap-6 ${
          results.size === 2
            ? 'grid-cols-1 lg:grid-cols-2'
            : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
        }`}
      >
        {Array.from(results.entries()).map(([algorithmName, result]) => (
          <ComparisonCard
            key={algorithmName}
            algorithmName={algorithmName}
            result={result}
            currentStep={animation.currentStep}
            category={category}
            inputs={inputs}
          />
        ))}
      </div>
    </div>
  );
}

interface ComparisonCardProps {
  algorithmName: string;
  result: PageReplacementResult | SchedulingResult | DiskSchedulingResult;
  currentStep: number;
  category: AlgorithmCategory;
  inputs: Record<string, unknown>;
}

function ComparisonCard({
  algorithmName,
  result,
  currentStep,
  category,
  inputs,
}: ComparisonCardProps) {
  // Ensure we don't go beyond available steps for this algorithm
  const safeCurrentStep = Math.min(currentStep, result.steps.length - 1);
  const currentStepData = result.steps[safeCurrentStep];

  return (
    <Card variant="bordered" className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{algorithmName}</CardTitle>
          <Badge variant="active">
            Step {safeCurrentStep + 1}/{result.steps.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Visualization */}
          <div className="min-h-[300px] flex items-center justify-center">
            {category === 'page-replacement' && (
              <PageReplacementVisualization
                result={result as PageReplacementResult}
                currentStep={safeCurrentStep}
              />
            )}
            {category === 'cpu-scheduling' && (
              <CPUSchedulingVisualization
                result={result as SchedulingResult}
                currentStep={safeCurrentStep}
              />
            )}
            {category === 'disk-scheduling' && (
              <DiskSchedulingVisualization
                result={result as DiskSchedulingResult}
                currentStep={safeCurrentStep}
                inputs={inputs}
              />
            )}
          </div>

          {/* Current Step Explanation */}
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              {currentStepData.explanation}
            </p>
          </div>

          {/* Metrics Summary */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
            {category === 'page-replacement' && (
              <PageReplacementMetricsSummary result={result as PageReplacementResult} />
            )}
            {category === 'cpu-scheduling' && (
              <CPUSchedulingMetricsSummary result={result as SchedulingResult} />
            )}
            {category === 'disk-scheduling' && (
              <DiskSchedulingMetricsSummary result={result as DiskSchedulingResult} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PageReplacementVisualization({
  result,
  currentStep,
}: {
  result: PageReplacementResult;
  currentStep: number;
}) {
  const step = result.steps[currentStep];
  return (
    <div className="w-full">
      <PageFrameDisplay
        frames={step.frames}
        highlightIndex={step.replacedFrameIndex}
        action={step.action}
      />
    </div>
  );
}

function CPUSchedulingVisualization({
  result,
  currentStep,
}: {
  result: SchedulingResult;
  currentStep: number;
}) {
  const step = result.steps[currentStep];
  return (
    <div className="w-full">
      <GanttChart ganttChart={result.ganttChart} currentTime={step.currentTime} />
    </div>
  );
}

function DiskSchedulingVisualization({
  result,
  currentStep,
  inputs,
}: {
  result: DiskSchedulingResult;
  currentStep: number;
  inputs: Record<string, unknown>;
}) {
  return (
    <div className="w-full">
      <DiskTrack
        diskSize={(inputs.diskSize as number) || 200}
        seekSequence={result.seekSequence}
        currentStep={currentStep}
        initialPosition={(inputs.initialPosition as number) || 50}
      />
    </div>
  );
}

function PageReplacementMetricsSummary({ result }: { result: PageReplacementResult }) {
  return (
    <>
      <MetricItem label="Page Faults" value={result.totalPageFaults} variant="error" />
      <MetricItem label="Page Hits" value={result.totalHits} variant="success" />
      <MetricItem
        label="Hit Ratio"
        value={`${(result.hitRatio * 100).toFixed(1)}%`}
        variant="neutral"
      />
      <MetricItem
        label="Miss Ratio"
        value={`${(result.missRatio * 100).toFixed(1)}%`}
        variant="neutral"
      />
    </>
  );
}

function CPUSchedulingMetricsSummary({ result }: { result: SchedulingResult }) {
  return (
    <>
      <MetricItem
        label="Avg WT"
        value={result.averageWaitingTime.toFixed(2)}
        variant="neutral"
      />
      <MetricItem
        label="Avg TAT"
        value={result.averageTurnaroundTime.toFixed(2)}
        variant="neutral"
      />
    </>
  );
}

function DiskSchedulingMetricsSummary({ result }: { result: DiskSchedulingResult }) {
  return (
    <>
      <MetricItem label="Total Seek" value={result.totalSeekTime} variant="neutral" />
      <MetricItem
        label="Avg Seek"
        value={result.averageSeekTime.toFixed(2)}
        variant="neutral"
      />
    </>
  );
}

function MetricItem({
  label,
  value,
  variant,
}: {
  label: string;
  value: string | number;
  variant: 'success' | 'error' | 'neutral';
}) {
  const colorClasses = {
    success: 'text-green-700 dark:text-green-400',
    error: 'text-red-700 dark:text-red-400',
    neutral: 'text-zinc-700 dark:text-zinc-300',
  };

  return (
    <div>
      <div className="text-xs text-zinc-500 dark:text-zinc-500 mb-1">{label}</div>
      <div className={`text-lg font-semibold ${colorClasses[variant]}`}>{value}</div>
    </div>
  );
}

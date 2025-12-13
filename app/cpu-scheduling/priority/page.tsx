'use client';

import { useState, useMemo } from 'react';
import { runPriority } from '@/lib/algorithms/cpu-scheduling/priority';
import { useAnimationControl } from '@/hooks/useAnimationControl';
import { VisualizationContainer } from '@/components/visualizers/shared/VisualizationContainer';
import { ControlPanel } from '@/components/visualizers/shared/ControlPanel';
import { SpeedControl } from '@/components/visualizers/shared/SpeedControl';
import { ExplanationPanel } from '@/components/visualizers/shared/ExplanationPanel';
import { GanttChart } from '@/components/visualizers/cpu-scheduling/GanttChart';
import { ProcessTable } from '@/components/visualizers/cpu-scheduling/ProcessTable';
import { SchedulingMetrics } from '@/components/visualizers/cpu-scheduling/SchedulingMetrics';
import { SchedulingInputs } from '@/components/visualizers/cpu-scheduling/SchedulingInputs';
import { Button } from '@/components/ui/Button';
import type { Process } from '@/lib/algorithms/cpu-scheduling/types';

export default function PriorityPage() {
  const [processes, setProcesses] = useState<Process[]>([
    { id: 1, name: 'P1', arrivalTime: 0, burstTime: 5, priority: 2 },
    { id: 2, name: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
    { id: 3, name: 'P3', arrivalTime: 2, burstTime: 8, priority: 3 },
    { id: 4, name: 'P4', arrivalTime: 3, burstTime: 6, priority: 2 }
  ]);
  const [preemptive, setPreemptive] = useState(false);

  const result = useMemo(() => runPriority(processes, preemptive), [processes, preemptive]);
  const animation = useAnimationControl(result.steps.length);
  const currentStep = result.steps[animation.currentStep];

  return (
    <VisualizationContainer
      title={`Priority Scheduling ${preemptive ? '(Preemptive)' : '(Non-preemptive)'}`}
      description="Schedules processes based on priority values (lower number = higher priority)"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          <div className="flex gap-2">
            <Button
              variant={!preemptive ? 'primary' : 'secondary'}
              onClick={() => { setPreemptive(false); animation.reset(); }}
            >
              Non-preemptive
            </Button>
            <Button
              variant={preemptive ? 'primary' : 'secondary'}
              onClick={() => { setPreemptive(true); animation.reset(); }}
            >
              Preemptive
            </Button>
          </div>
          <GanttChart ganttChart={result.ganttChart} currentTime={currentStep.currentTime} />
          <ControlPanel {...animation} />
          <SpeedControl speed={animation.speed} setSpeed={animation.setSpeed} />
          <ProcessTable processMetrics={result.processMetrics} />
          <SchedulingMetrics result={result} />
        </div>

        <div className="space-y-6">
          <SchedulingInputs
            initialProcesses={processes}
            onSubmit={(newProcesses) => { setProcesses(newProcesses); animation.reset(); }}
            showPriority
          />
          <ExplanationPanel
            algorithmName={preemptive ? "Priority (Preemptive)" : "Priority (Non-preemptive)"}
            description={preemptive ? "Preemptive priority scheduling can interrupt the current process if a higher priority process arrives." : "Each process has a priority. Lower priority number means higher priority. Can lead to starvation of low-priority processes."}
            currentStepExplanation={currentStep.explanation}
            currentAction={currentStep.runningProcess !== null ? 'active' : 'neutral'}
          />
        </div>
      </div>
    </VisualizationContainer>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { runSJF } from '@/lib/algorithms/cpu-scheduling/sjf';
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

export default function SJFPage() {
  const [processes, setProcesses] = useState<Process[]>([
    { id: 1, name: 'P1', arrivalTime: 0, burstTime: 6 },
    { id: 2, name: 'P2', arrivalTime: 1, burstTime: 2 },
    { id: 3, name: 'P3', arrivalTime: 2, burstTime: 8 },
    { id: 4, name: 'P4', arrivalTime: 3, burstTime: 3 }
  ]);
  const [preemptive, setPreemptive] = useState(false);

  const result = useMemo(() => runSJF(processes, preemptive), [processes, preemptive]);
  const animation = useAnimationControl(result.steps.length);
  const currentStep = result.steps[animation.currentStep];

  return (
    <VisualizationContainer
      title={`SJF - Shortest Job First ${preemptive ? '(Preemptive/SRTF)' : '(Non-preemptive)'}`}
      description={preemptive ? "Preemptive version (SRTF) - switches to process with shortest remaining time" : "Selects process with smallest burst time first"}
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
              Preemptive (SRTF)
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
          />
          <ExplanationPanel
            algorithmName={preemptive ? "SJF (Preemptive/SRTF)" : "SJF (Non-preemptive)"}
            description={preemptive ? "SRTF (Shortest Remaining Time First) is the preemptive version of SJF. It switches to the process with the shortest remaining execution time." : "SJF selects the process with the smallest burst time. Minimizes average waiting time but can cause starvation."}
            currentStepExplanation={currentStep.explanation}
            currentAction={currentStep.runningProcess !== null ? 'active' : 'neutral'}
          />
        </div>
      </div>
    </VisualizationContainer>
  );
}

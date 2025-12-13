'use client';

import { useState, useMemo } from 'react';
import { runRoundRobin } from '@/lib/algorithms/cpu-scheduling/round-robin';
import { useAnimationControl } from '@/hooks/useAnimationControl';
import { VisualizationContainer } from '@/components/visualizers/shared/VisualizationContainer';
import { ControlPanel } from '@/components/visualizers/shared/ControlPanel';
import { SpeedControl } from '@/components/visualizers/shared/SpeedControl';
import { ExplanationPanel } from '@/components/visualizers/shared/ExplanationPanel';
import { GanttChart } from '@/components/visualizers/cpu-scheduling/GanttChart';
import { ProcessTable } from '@/components/visualizers/cpu-scheduling/ProcessTable';
import { SchedulingMetrics } from '@/components/visualizers/cpu-scheduling/SchedulingMetrics';
import { SchedulingInputs } from '@/components/visualizers/cpu-scheduling/SchedulingInputs';
import type { Process } from '@/lib/algorithms/cpu-scheduling/types';

export default function RoundRobinPage() {
  const [processes, setProcesses] = useState<Process[]>([
    { id: 1, name: 'P1', arrivalTime: 0, burstTime: 5 },
    { id: 2, name: 'P2', arrivalTime: 1, burstTime: 3 },
    { id: 3, name: 'P3', arrivalTime: 2, burstTime: 8 },
    { id: 4, name: 'P4', arrivalTime: 3, burstTime: 6 }
  ]);
  const [quantum, setQuantum] = useState(2);

  const result = useMemo(() => runRoundRobin(processes, quantum), [processes, quantum]);
  const animation = useAnimationControl(result.steps.length);
  const currentStep = result.steps[animation.currentStep];

  return (
    <VisualizationContainer
      title="Round Robin"
      description="Each process gets a fixed time quantum in circular order"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
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
            showQuantum
            initialQuantum={quantum}
            onQuantumChange={(q) => { setQuantum(q); animation.reset(); }}
          />
          <ExplanationPanel
            algorithmName="Round Robin Algorithm"
            description="Round Robin is a preemptive algorithm where each process gets a fixed time quantum. If a process doesn't complete within its quantum, it's moved to the back of the ready queue. Fair and prevents starvation."
            currentStepExplanation={currentStep.explanation}
            currentAction={currentStep.runningProcess !== null ? 'active' : 'neutral'}
          />
        </div>
      </div>
    </VisualizationContainer>
  );
}

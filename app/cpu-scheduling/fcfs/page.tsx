'use client';

import { useState, useMemo } from 'react';
import { runFCFS } from '@/lib/algorithms/cpu-scheduling/fcfs';
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

/**
 * FCFS CPU Scheduling Visualizer
 */
export default function FCFSPage() {
  const [processes, setProcesses] = useState<Process[]>([
    { id: 1, name: 'P1', arrivalTime: 0, burstTime: 5 },
    { id: 2, name: 'P2', arrivalTime: 1, burstTime: 3 },
    { id: 3, name: 'P3', arrivalTime: 2, burstTime: 8 },
    { id: 4, name: 'P4', arrivalTime: 3, burstTime: 6 }
  ]);

  const result = useMemo(() => runFCFS(processes), [processes]);
  const animation = useAnimationControl(result.steps.length);
  const currentStep = result.steps[animation.currentStep];

  const pseudocode = [
    'sort processes by arrival time',
    'for each process in sorted order:',
    '  wait for process arrival',
    '  execute process to completion',
    '  calculate metrics'
  ];

  return (
    <VisualizationContainer
      title="FCFS - First Come First Serve"
      description="Non-preemptive algorithm that executes processes in order of arrival"
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
            onSubmit={(newProcesses) => {
              setProcesses(newProcesses);
              animation.reset();
            }}
          />
          <ExplanationPanel
            algorithmName="FCFS Algorithm"
            description="FCFS is the simplest CPU scheduling algorithm. Processes are executed in the order they arrive. While fair, it can lead to the convoy effect where short processes wait for long ones."
            currentStepExplanation={currentStep.explanation}
            currentAction={currentStep.runningProcess !== null ? 'active' : 'neutral'}
            pseudocode={pseudocode}
          />
        </div>
      </div>
    </VisualizationContainer>
  );
}

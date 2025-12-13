'use client';

import { useState, useMemo } from 'react';
import { runDiskFCFS } from '@/lib/algorithms/disk-scheduling/fcfs';
import { useAnimationControl } from '@/hooks/useAnimationControl';
import { VisualizationContainer } from '@/components/visualizers/shared/VisualizationContainer';
import { ControlPanel } from '@/components/visualizers/shared/ControlPanel';
import { SpeedControl } from '@/components/visualizers/shared/SpeedControl';
import { ExplanationPanel } from '@/components/visualizers/shared/ExplanationPanel';
import { DiskTrack } from '@/components/visualizers/disk-scheduling/DiskTrack';
import { DiskMetrics } from '@/components/visualizers/disk-scheduling/DiskMetrics';
import { DiskInputs } from '@/components/visualizers/disk-scheduling/DiskInputs';

export default function DiskFCFSPage() {
  const [initialPosition, setInitialPosition] = useState(50);
  const [requests, setRequests] = useState([82, 170, 43, 140, 24, 16, 190]);
  const [diskSize, setDiskSize] = useState(200);

  const result = useMemo(
    () => runDiskFCFS(initialPosition, requests),
    [initialPosition, requests]
  );
  const animation = useAnimationControl(result.steps.length);
  const currentStep = result.steps[animation.currentStep];

  return (
    <VisualizationContainer
      title="FCFS Disk Scheduling"
      description="Services disk requests in the order they arrive"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          <DiskTrack
            diskSize={diskSize}
            seekSequence={result.seekSequence}
            currentStep={animation.currentStep}
            initialPosition={initialPosition}
          />
          <ControlPanel {...animation} />
          <SpeedControl speed={animation.speed} setSpeed={animation.setSpeed} />
          <DiskMetrics result={result} />
        </div>

        <div className="space-y-6">
          <DiskInputs
            initialPosition={initialPosition}
            initialRequests={requests}
            initialDiskSize={diskSize}
            onSubmit={(pos, req, size) => {
              setInitialPosition(pos);
              setRequests(req);
              setDiskSize(size);
              animation.reset();
            }}
          />
          <ExplanationPanel
            algorithmName="FCFS Disk Scheduling"
            description="FCFS services disk I/O requests in the order they arrive. Simple but can result in large seek times if requests are scattered across the disk."
            currentStepExplanation={currentStep.explanation}
            currentAction="active"
          />
        </div>
      </div>
    </VisualizationContainer>
  );
}

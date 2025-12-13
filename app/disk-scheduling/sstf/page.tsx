'use client';

import { useState, useMemo } from 'react';
import { runSSTF } from '@/lib/algorithms/disk-scheduling/sstf';
import { useAnimationControl } from '@/hooks/useAnimationControl';
import { VisualizationContainer } from '@/components/visualizers/shared/VisualizationContainer';
import { ControlPanel } from '@/components/visualizers/shared/ControlPanel';
import { SpeedControl } from '@/components/visualizers/shared/SpeedControl';
import { ExplanationPanel } from '@/components/visualizers/shared/ExplanationPanel';
import { DiskTrack } from '@/components/visualizers/disk-scheduling/DiskTrack';
import { DiskMetrics } from '@/components/visualizers/disk-scheduling/DiskMetrics';
import { DiskInputs } from '@/components/visualizers/disk-scheduling/DiskInputs';

export default function SSTFPage() {
  const [initialPosition, setInitialPosition] = useState(50);
  const [requests, setRequests] = useState([82, 170, 43, 140, 24, 16, 190]);
  const [diskSize, setDiskSize] = useState(200);

  const result = useMemo(() => runSSTF(initialPosition, requests), [initialPosition, requests]);
  const animation = useAnimationControl(result.steps.length);
  const currentStep = result.steps[animation.currentStep];

  return (
    <VisualizationContainer
      title="SSTF - Shortest Seek Time First"
      description="Services the request closest to the current head position"
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
            algorithmName="SSTF Algorithm"
            description="SSTF selects the request with the minimum seek time from the current head position. Reduces average seek time but can cause starvation of far requests."
            currentStepExplanation={currentStep.explanation}
            currentAction="active"
          />
        </div>
      </div>
    </VisualizationContainer>
  );
}

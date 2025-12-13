'use client';

import { useState, useMemo } from 'react';
import { runCSCAN } from '@/lib/algorithms/disk-scheduling/c-scan';
import { useAnimationControl } from '@/hooks/useAnimationControl';
import { VisualizationContainer } from '@/components/visualizers/shared/VisualizationContainer';
import { ControlPanel } from '@/components/visualizers/shared/ControlPanel';
import { SpeedControl } from '@/components/visualizers/shared/SpeedControl';
import { ExplanationPanel } from '@/components/visualizers/shared/ExplanationPanel';
import { DiskTrack } from '@/components/visualizers/disk-scheduling/DiskTrack';
import { DiskMetrics } from '@/components/visualizers/disk-scheduling/DiskMetrics';
import { DiskInputs } from '@/components/visualizers/disk-scheduling/DiskInputs';
import type { Direction } from '@/lib/algorithms/disk-scheduling/types';

export default function CSCANPage() {
  const [initialPosition, setInitialPosition] = useState(50);
  const [requests, setRequests] = useState([82, 170, 43, 140, 24, 16, 190]);
  const [diskSize, setDiskSize] = useState(200);
  const [direction, setDirection] = useState<Direction>('right');

  const result = useMemo(
    () => runCSCAN(initialPosition, requests, diskSize, direction),
    [initialPosition, requests, diskSize, direction]
  );
  const animation = useAnimationControl(result.steps.length);
  const currentStep = result.steps[animation.currentStep];

  return (
    <VisualizationContainer
      title="C-SCAN - Circular SCAN"
      description="Head moves in one direction, then jumps to the other end and continues"
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
            initialDirection={direction}
            showDirection
            onSubmit={(pos, req, size, dir) => {
              setInitialPosition(pos);
              setRequests(req);
              setDiskSize(size);
              setDirection(dir);
              animation.reset();
            }}
          />
          <ExplanationPanel
            algorithmName="C-SCAN Algorithm"
            description="C-SCAN (Circular SCAN) provides more uniform wait times than SCAN by always moving in the same direction. After reaching one end, it jumps to the opposite end and continues."
            currentStepExplanation={currentStep.explanation}
            currentAction="active"
          />
        </div>
      </div>
    </VisualizationContainer>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { runSCAN } from '@/lib/algorithms/disk-scheduling/scan';
import { useAnimationControl } from '@/hooks/useAnimationControl';
import { VisualizationContainer } from '@/components/visualizers/shared/VisualizationContainer';
import { ControlPanel } from '@/components/visualizers/shared/ControlPanel';
import { SpeedControl } from '@/components/visualizers/shared/SpeedControl';
import { ExplanationPanel } from '@/components/visualizers/shared/ExplanationPanel';
import { DiskTrack } from '@/components/visualizers/disk-scheduling/DiskTrack';
import { DiskMetrics } from '@/components/visualizers/disk-scheduling/DiskMetrics';
import { DiskInputs } from '@/components/visualizers/disk-scheduling/DiskInputs';
import type { Direction } from '@/lib/algorithms/disk-scheduling/types';

export default function SCANPage() {
  const [initialPosition, setInitialPosition] = useState(50);
  const [requests, setRequests] = useState([82, 170, 43, 140, 24, 16, 190]);
  const [diskSize, setDiskSize] = useState(200);
  const [direction, setDirection] = useState<Direction>('right');

  const result = useMemo(
    () => runSCAN(initialPosition, requests, diskSize, direction),
    [initialPosition, requests, diskSize, direction]
  );
  const animation = useAnimationControl(result.steps.length);
  const currentStep = result.steps[animation.currentStep];

  return (
    <VisualizationContainer
      title="SCAN - Elevator Algorithm"
      description="Head moves in one direction servicing requests, then reverses"
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
            algorithmName="SCAN Algorithm"
            description="SCAN (Elevator Algorithm) moves the disk arm in one direction servicing requests until reaching the end, then reverses direction. Provides more uniform wait times than SSTF."
            currentStepExplanation={currentStep.explanation}
            currentAction="active"
          />
        </div>
      </div>
    </VisualizationContainer>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { runOptimal } from '@/lib/algorithms/page-replacement/optimal';
import { useAnimationControl } from '@/hooks/useAnimationControl';
import { VisualizationContainer } from '@/components/visualizers/shared/VisualizationContainer';
import { ControlPanel } from '@/components/visualizers/shared/ControlPanel';
import { SpeedControl } from '@/components/visualizers/shared/SpeedControl';
import { ExplanationPanel } from '@/components/visualizers/shared/ExplanationPanel';
import { PageFrameDisplay } from '@/components/visualizers/page-replacement/PageFrameDisplay';
import { PageRequestQueue } from '@/components/visualizers/page-replacement/PageRequestQueue';
import { PageReplacementMetrics } from '@/components/visualizers/page-replacement/PageReplacementMetrics';
import { PageReplacementInputs } from '@/components/visualizers/page-replacement/PageReplacementInputs';

/**
 * Optimal Page Replacement Visualizer
 */
export default function OptimalPage() {
  const [pageRequests, setPageRequests] = useState<number[]>([7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2]);
  const [numFrames, setNumFrames] = useState(3);

  const result = useMemo(() => runOptimal(pageRequests, numFrames), [pageRequests, numFrames]);
  const animation = useAnimationControl(result.steps.length);
  const currentStep = result.steps[animation.currentStep];

  const handleInputSubmit = (newPages: number[], newFrames: number) => {
    setPageRequests(newPages);
    setNumFrames(newFrames);
    animation.reset();
  };

  const pseudocode = [
    'for each page in page_requests:',
    '  if page in frames:',
    '    page_hit++',
    '  else:',
    '    page_fault++',
    '    if empty_frame exists:',
    '      load page into empty_frame',
    '    else:',
    '      find page used farthest in future',
    '      replace that page'
  ];

  return (
    <VisualizationContainer
      title="Optimal Page Replacement"
      description="Replaces the page that won't be used for the longest time in the future (theoretical benchmark)"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          <PageRequestQueue pageRequests={pageRequests} currentIndex={animation.currentStep} />
          <PageFrameDisplay
            frames={currentStep.frames}
            highlightIndex={currentStep.action === 'hit' ? currentStep.hitFrameIndex : currentStep.replacedFrameIndex}
            action={currentStep.action}
          />
          <ControlPanel {...animation} />
          <SpeedControl speed={animation.speed} setSpeed={animation.setSpeed} />
          <PageReplacementMetrics result={result} />
        </div>

        <div className="space-y-6">
          <PageReplacementInputs
            initialPageRequests={pageRequests}
            initialNumFrames={numFrames}
            onSubmit={handleInputSubmit}
          />
          <ExplanationPanel
            algorithmName="Optimal Algorithm"
            description="The Optimal algorithm is a theoretical benchmark that requires future knowledge. It replaces the page that will not be used for the longest time. While not practical, it provides the best possible performance to compare other algorithms against."
            currentStepExplanation={currentStep.explanation}
            currentAction={currentStep.action === 'hit' ? 'success' : 'error'}
            pseudocode={pseudocode}
            activeLineIndex={currentStep.action === 'hit' ? 2 : 8}
          />
        </div>
      </div>
    </VisualizationContainer>
  );
}

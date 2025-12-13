'use client';

import { useState, useMemo } from 'react';
import { runLRU } from '@/lib/algorithms/page-replacement/lru';
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
 * LRU Page Replacement Visualizer
 */
export default function LRUPage() {
  const [pageRequests, setPageRequests] = useState<number[]>([7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2]);
  const [numFrames, setNumFrames] = useState(3);

  const result = useMemo(() => runLRU(pageRequests, numFrames), [pageRequests, numFrames]);
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
    '    update last_used_time[page]',
    '  else:',
    '    page_fault++',
    '    if empty_frame exists:',
    '      load page into empty_frame',
    '    else:',
    '      find LRU page (min last_used_time)',
    '      replace LRU page with new page'
  ];

  return (
    <VisualizationContainer
      title="LRU - Least Recently Used"
      description="Replaces the page that hasn't been used for the longest time"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          <PageRequestQueue pageRequests={pageRequests} currentIndex={animation.currentStep} />
          <PageFrameDisplay
            frames={currentStep.frames}
            highlightIndex={currentStep.replacedFrameIndex}
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
            algorithmName="LRU Algorithm"
            description="LRU (Least Recently Used) tracks when each page was last accessed and replaces the page that has been unused for the longest period. It approximates optimal by using past access patterns to predict future usage."
            currentStepExplanation={currentStep.explanation}
            currentAction={currentStep.action === 'hit' ? 'success' : 'error'}
            pseudocode={pseudocode}
            activeLineIndex={currentStep.action === 'hit' ? 2 : 9}
          />
        </div>
      </div>
    </VisualizationContainer>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { runFIFO } from '@/lib/algorithms/page-replacement/fifo';
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
 * FIFO Page Replacement Visualizer
 */
export default function FIFOPage() {
  const [pageRequests, setPageRequests] = useState<number[]>([7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2]);
  const [numFrames, setNumFrames] = useState(3);

  // Run algorithm and memoize result
  const result = useMemo(() => runFIFO(pageRequests, numFrames), [pageRequests, numFrames]);

  // Animation control
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
    '      replace oldest page (front of queue)',
    '      add page to queue'
  ];

  return (
    <VisualizationContainer
      title="FIFO - First In First Out"
      description="Replaces the oldest page in memory (the page that arrived first)"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Main visualization area */}
        <div className="space-y-6">
          {/* Page Request Queue */}
          <PageRequestQueue
            pageRequests={pageRequests}
            currentIndex={animation.currentStep}
          />

          {/* Memory Frames */}
          <PageFrameDisplay
            frames={currentStep.frames}
            highlightIndex={currentStep.replacedFrameIndex}
            action={currentStep.action}
          />

          {/* Control Panel */}
          <ControlPanel {...animation} />

          {/* Speed Control */}
          <SpeedControl speed={animation.speed} setSpeed={animation.setSpeed} />

          {/* Metrics */}
          <PageReplacementMetrics result={result} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Input Panel */}
          <PageReplacementInputs
            initialPageRequests={pageRequests}
            initialNumFrames={numFrames}
            onSubmit={handleInputSubmit}
          />

          {/* Explanation Panel */}
          <ExplanationPanel
            algorithmName="FIFO Algorithm"
            description="FIFO (First In First Out) is the simplest page replacement algorithm. It maintains a queue of pages and always replaces the oldest page (the one at the front of the queue)."
            currentStepExplanation={currentStep.explanation}
            currentAction={currentStep.action === 'hit' ? 'success' : 'error'}
            pseudocode={pseudocode}
            activeLineIndex={
              currentStep.action === 'hit' ? 2 : currentStep.replacedPage !== undefined ? 8 : 6
            }
          />
        </div>
      </div>
    </VisualizationContainer>
  );
}

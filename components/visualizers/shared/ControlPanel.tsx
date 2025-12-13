'use client';

import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { AnimationControl } from '@/types/controls';

interface ControlPanelProps extends AnimationControl {
  className?: string;
}

/**
 * Shared control panel for algorithm visualizations
 * Provides play/pause/step/reset controls
 */
export function ControlPanel({
  isPlaying,
  currentStep,
  totalSteps,
  play,
  pause,
  stepForward,
  stepBackward,
  reset,
  className
}: ControlPanelProps) {
  const canStepBack = currentStep > 0;
  const canStepForward = currentStep < totalSteps - 1;
  const isComplete = currentStep === totalSteps - 1;

  return (
    <div className={className}>
      <div className="flex items-center gap-2 flex-wrap">
        {/* Play/Pause Button */}
        <Button
          onClick={isPlaying ? pause : play}
          variant="primary"
          size="md"
          aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
          disabled={isComplete && !isPlaying}
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              {isComplete ? 'Replay' : 'Play'}
            </>
          )}
        </Button>

        {/* Step Backward Button */}
        <Button
          onClick={stepBackward}
          variant="secondary"
          size="md"
          disabled={!canStepBack}
          aria-label="Step backward"
        >
          <SkipBack className="w-5 h-5" />
        </Button>

        {/* Step Forward Button */}
        <Button
          onClick={stepForward}
          variant="secondary"
          size="md"
          disabled={!canStepForward}
          aria-label="Step forward"
        >
          <SkipForward className="w-5 h-5" />
        </Button>

        {/* Reset Button */}
        <Button
          onClick={reset}
          variant="ghost"
          size="md"
          aria-label="Reset animation"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset
        </Button>

        {/* Step Counter */}
        <div className="ml-auto text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Step {currentStep + 1} / {totalSteps}
        </div>
      </div>
    </div>
  );
}

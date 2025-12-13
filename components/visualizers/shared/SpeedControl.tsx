'use client';

import { Slider } from '@/components/ui/Slider';
import { SPEED_PRESETS } from '@/lib/constants/animation-config';

interface SpeedControlProps {
  speed: number;
  setSpeed: (speed: number) => void;
  className?: string;
}

/**
 * Speed control slider for animations
 */
export function SpeedControl({ speed, setSpeed, className }: SpeedControlProps) {
  const formatSpeed = (value: number) => `${value}x`;

  return (
    <div className={className}>
      <Slider
        label="Animation Speed"
        min={0.5}
        max={3}
        step={0.25}
        value={speed}
        onChange={setSpeed}
        showValue
        valueFormatter={formatSpeed}
      />
      <div className="flex gap-2 mt-2 flex-wrap">
        {Object.entries(SPEED_PRESETS).map(([name, value]) => (
          <button
            key={name}
            onClick={() => setSpeed(value)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              speed === value
                ? 'bg-blue-500 text-white'
                : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600'
            }`}
            aria-label={`Set speed to ${value}x`}
          >
            {value}x
          </button>
        ))}
      </div>
    </div>
  );
}

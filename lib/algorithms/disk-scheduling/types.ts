import type { AlgorithmStep, AlgorithmResult } from '@/types/algorithm';

/**
 * Direction for SCAN-based algorithms
 */
export type Direction = 'left' | 'right';

/**
 * Single step in disk scheduling execution
 */
export interface DiskSchedulingStep extends AlgorithmStep {
  step: number;
  currentPosition: number;
  targetTrack: number | null;
  seekDistance: number;
  direction?: Direction;
  explanation: string;
}

/**
 * Result returned by disk scheduling algorithms
 */
export interface DiskSchedulingResult extends AlgorithmResult<DiskSchedulingStep> {
  steps: DiskSchedulingStep[];
  seekSequence: number[];
  totalSeekTime: number;
  averageSeekTime: number;
}

import type { AlgorithmStep, AlgorithmResult } from '@/types/algorithm';

/**
 * Action type for page replacement
 */
export type PageAction = 'hit' | 'miss' | 'replace';

/**
 * Single step in page replacement algorithm execution
 */
export interface PageReplacementStep extends AlgorithmStep {
  step: number;
  currentPage: number;
  frames: (number | null)[];
  action: PageAction;
  replacedPage?: number | null;
  replacedFrameIndex?: number;
  hitFrameIndex?: number;
  explanation: string;
}

/**
 * Result returned by page replacement algorithms
 */
export interface PageReplacementResult extends AlgorithmResult<PageReplacementStep> {
  steps: PageReplacementStep[];
  totalPageFaults: number;
  totalHits: number;
  hitRatio: number;
  missRatio: number;
}

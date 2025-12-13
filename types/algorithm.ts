/**
 * Base types for all algorithm implementations
 * These interfaces define the contract between algorithm logic and UI components
 */

/**
 * Represents a single step in an algorithm's execution
 */
export interface AlgorithmStep {
  step: number;
  explanation: string;
  [key: string]: unknown; // Allow algorithm-specific properties
}

/**
 * Base result structure returned by all algorithms
 */
export interface AlgorithmResult<T extends AlgorithmStep = AlgorithmStep> {
  steps: T[];
  [key: string]: unknown; // Allow algorithm-specific metrics
}

/**
 * Algorithm category types
 */
export type AlgorithmCategory =
  | 'page-replacement'
  | 'cpu-scheduling'
  | 'disk-scheduling'
  | 'deadlock';

/**
 * Algorithm metadata for display and navigation
 */
export interface AlgorithmInfo {
  id: string;
  name: string;
  category: AlgorithmCategory;
  description: string;
  path: string;
  complexity?: string;
}

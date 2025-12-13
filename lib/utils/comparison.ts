/**
 * Comparison utilities for comparing multiple algorithm results side-by-side
 */

import type { PageReplacementResult } from '../algorithms/page-replacement/types';
import type { SchedulingResult } from '../algorithms/cpu-scheduling/types';
import type { DiskSchedulingResult } from '../algorithms/disk-scheduling/types';

/**
 * Algorithm category types
 */
export type AlgorithmCategory = 'page-replacement' | 'cpu-scheduling' | 'disk-scheduling';

/**
 * Available algorithms per category
 */
export const CATEGORY_ALGORITHMS = {
  'page-replacement': [
    { id: 'fifo', name: 'FIFO', fullName: 'First In First Out' },
    { id: 'lru', name: 'LRU', fullName: 'Least Recently Used' },
    { id: 'optimal', name: 'Optimal', fullName: 'Optimal Page Replacement' },
    { id: 'lfu', name: 'LFU', fullName: 'Least Frequently Used' },
  ],
  'cpu-scheduling': [
    { id: 'fcfs', name: 'FCFS', fullName: 'First Come First Serve' },
    { id: 'sjf', name: 'SJF', fullName: 'Shortest Job First' },
    { id: 'priority', name: 'Priority', fullName: 'Priority Scheduling' },
    { id: 'round-robin', name: 'Round Robin', fullName: 'Round Robin' },
  ],
  'disk-scheduling': [
    { id: 'fcfs', name: 'FCFS', fullName: 'First Come First Serve' },
    { id: 'sstf', name: 'SSTF', fullName: 'Shortest Seek Time First' },
    { id: 'scan', name: 'SCAN', fullName: 'SCAN (Elevator)' },
    { id: 'c-scan', name: 'C-SCAN', fullName: 'Circular SCAN' },
  ],
} as const;

/**
 * Page Replacement comparison metrics
 */
export interface PageReplacementComparison {
  algorithmName: string;
  totalPageFaults: number;
  totalHits: number;
  hitRatio: number;
  missRatio: number;
}

/**
 * CPU Scheduling comparison metrics
 */
export interface CPUSchedulingComparison {
  algorithmName: string;
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  averageResponseTime: number;
  totalCompletionTime: number;
}

/**
 * Disk Scheduling comparison metrics
 */
export interface DiskSchedulingComparison {
  algorithmName: string;
  totalSeekTime: number;
  averageSeekTime: number;
  totalRequests: number;
}

/**
 * Extract comparison metrics from Page Replacement results
 */
export function extractPageReplacementMetrics(
  results: Map<string, PageReplacementResult>
): PageReplacementComparison[] {
  return Array.from(results.entries()).map(([algorithmName, result]) => ({
    algorithmName,
    totalPageFaults: result.totalPageFaults,
    totalHits: result.totalHits,
    hitRatio: result.hitRatio,
    missRatio: result.missRatio,
  }));
}

/**
 * Extract comparison metrics from CPU Scheduling results
 */
export function extractCPUSchedulingMetrics(
  results: Map<string, SchedulingResult>
): CPUSchedulingComparison[] {
  return Array.from(results.entries()).map(([algorithmName, result]) => {
    return {
      algorithmName,
      averageWaitingTime: result.averageWaitingTime,
      averageTurnaroundTime: result.averageTurnaroundTime,
      averageResponseTime: result.averageResponseTime,
      totalCompletionTime: result.totalTime,
    };
  });
}

/**
 * Extract comparison metrics from Disk Scheduling results
 */
export function extractDiskSchedulingMetrics(
  results: Map<string, DiskSchedulingResult>
): DiskSchedulingComparison[] {
  return Array.from(results.entries()).map(([algorithmName, result]) => ({
    algorithmName,
    totalSeekTime: result.totalSeekTime,
    averageSeekTime: result.averageSeekTime,
    totalRequests: result.seekSequence.length - 1, // Exclude initial position
  }));
}

/**
 * Find the best algorithm for Page Replacement (highest hit ratio)
 */
export function findBestPageReplacementAlgorithm(
  comparisons: PageReplacementComparison[]
): string {
  return comparisons.reduce((best, current) =>
    current.hitRatio > best.hitRatio ? current : best
  ).algorithmName;
}

/**
 * Find the best algorithm for CPU Scheduling (lowest average waiting time)
 */
export function findBestCPUSchedulingAlgorithm(
  comparisons: CPUSchedulingComparison[]
): string {
  return comparisons.reduce((best, current) =>
    current.averageWaitingTime < best.averageWaitingTime ? current : best
  ).algorithmName;
}

/**
 * Find the best algorithm for Disk Scheduling (lowest total seek time)
 */
export function findBestDiskSchedulingAlgorithm(
  comparisons: DiskSchedulingComparison[]
): string {
  return comparisons.reduce((best, current) =>
    current.totalSeekTime < best.totalSeekTime ? current : best
  ).algorithmName;
}

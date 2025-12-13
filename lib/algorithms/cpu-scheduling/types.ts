import type { AlgorithmStep, AlgorithmResult } from '@/types/algorithm';

/**
 * Process definition for CPU scheduling
 */
export interface Process {
  id: number;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority?: number;
  remainingTime?: number;
}

/**
 * Process state
 */
export type ProcessState = 'waiting' | 'running' | 'completed';

/**
 * Gantt chart segment representing execution time
 */
export interface GanttSegment {
  processId: number;
  processName: string;
  startTime: number;
  endTime: number;
}

/**
 * Single step in CPU scheduling execution
 */
export interface SchedulingStep extends AlgorithmStep {
  step: number;
  currentTime: number;
  runningProcess: number | null;
  readyQueue: number[];
  completedProcesses: number[];
  ganttSegment?: GanttSegment;
  explanation: string;
}

/**
 * Process metrics
 */
export interface ProcessMetrics {
  processId: number;
  processName: string;
  arrivalTime: number;
  burstTime: number;
  completionTime: number;
  turnaroundTime: number;
  waitingTime: number;
  responseTime: number;
}

/**
 * Result returned by CPU scheduling algorithms
 */
export interface SchedulingResult extends AlgorithmResult<SchedulingStep> {
  steps: SchedulingStep[];
  ganttChart: GanttSegment[];
  processMetrics: ProcessMetrics[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  averageResponseTime: number;
  cpuUtilization: number;
  totalTime: number;
}

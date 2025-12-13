import type { Process, SchedulingResult, SchedulingStep, GanttSegment, ProcessMetrics } from './types';

/**
 * FCFS (First Come First Serve) CPU Scheduling Algorithm
 *
 * Non-preemptive algorithm that executes processes in order of arrival.
 * Simple but can lead to convoy effect.
 *
 * @param processes - Array of processes to schedule
 * @returns Complete execution trace with steps and metrics
 */
export function runFCFS(processes: Process[]): SchedulingResult {
  const steps: SchedulingStep[] = [];
  const ganttChart: GanttSegment[] = [];
  const processMetrics: ProcessMetrics[] = [];

  // Sort by arrival time
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

  let currentTime = 0;
  const completedProcesses: number[] = [];
  const responseTime = new Map<number, number>();

  sortedProcesses.forEach((process, index) => {
    // Wait for process arrival if CPU is idle
    if (currentTime < process.arrivalTime) {
      steps.push({
        step: steps.length,
        currentTime,
        runningProcess: null,
        readyQueue: [],
        completedProcesses: [...completedProcesses],
        explanation: `CPU idle, waiting for process ${process.name} to arrive at time ${process.arrivalTime}`
      });
      currentTime = process.arrivalTime;
    }

    // Record response time (first time process gets CPU)
    responseTime.set(process.id, currentTime - process.arrivalTime);

    const startTime = currentTime;
    const endTime = currentTime + process.burstTime;

    // Add gantt segment
    const ganttSegment: GanttSegment = {
      processId: process.id,
      processName: process.name,
      startTime,
      endTime
    };
    ganttChart.push(ganttSegment);

    // Add execution steps
    steps.push({
      step: steps.length,
      currentTime: startTime,
      runningProcess: process.id,
      readyQueue: sortedProcesses.slice(index + 1).filter(p => p.arrivalTime <= startTime).map(p => p.id),
      completedProcesses: [...completedProcesses],
      ganttSegment,
      explanation: `Process ${process.name} starts execution (arrived at ${process.arrivalTime}, burst time: ${process.burstTime})`
    });

    currentTime = endTime;
    completedProcesses.push(process.id);

    steps.push({
      step: steps.length,
      currentTime,
      runningProcess: null,
      readyQueue: sortedProcesses.slice(index + 1).filter(p => p.arrivalTime <= currentTime).map(p => p.id),
      completedProcesses: [...completedProcesses],
      explanation: `Process ${process.name} completed at time ${currentTime}`
    });

    // Calculate metrics
    const completionTime = endTime;
    const turnaroundTime = completionTime - process.arrivalTime;
    const waitingTime = turnaroundTime - process.burstTime;

    processMetrics.push({
      processId: process.id,
      processName: process.name,
      arrivalTime: process.arrivalTime,
      burstTime: process.burstTime,
      completionTime,
      turnaroundTime,
      waitingTime,
      responseTime: responseTime.get(process.id)!
    });
  });

  const totalTime = currentTime;
  const avgWaitingTime = processMetrics.reduce((sum, m) => sum + m.waitingTime, 0) / processes.length;
  const avgTurnaroundTime = processMetrics.reduce((sum, m) => sum + m.turnaroundTime, 0) / processes.length;
  const avgResponseTime = processMetrics.reduce((sum, m) => sum + m.responseTime, 0) / processes.length;
  const totalBurstTime = processes.reduce((sum, p) => sum + p.burstTime, 0);
  const cpuUtilization = (totalBurstTime / totalTime) * 100;

  return {
    steps,
    ganttChart,
    processMetrics,
    averageWaitingTime: avgWaitingTime,
    averageTurnaroundTime: avgTurnaroundTime,
    averageResponseTime: avgResponseTime,
    cpuUtilization,
    totalTime
  };
}

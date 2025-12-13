import type { Process, SchedulingResult, SchedulingStep, GanttSegment, ProcessMetrics } from './types';

/**
 * Priority Scheduling Algorithm
 *
 * @param processes - Array of processes to schedule (must have priority field)
 * @param preemptive - Whether to use preemptive or non-preemptive priority scheduling
 * @returns Complete execution trace with steps and metrics
 */
export function runPriority(processes: Process[], preemptive: boolean = false): SchedulingResult {
  if (preemptive) {
    return runPreemptivePriority(processes);
  }
  return runNonPreemptivePriority(processes);
}

/**
 * Non-preemptive Priority Scheduling
 * Lower priority number = higher priority
 */
function runNonPreemptivePriority(processes: Process[]): SchedulingResult {
  const steps: SchedulingStep[] = [];
  const ganttChart: GanttSegment[] = [];
  const processMetrics: ProcessMetrics[] = [];

  const remaining = [...processes];
  let currentTime = 0;
  const completedProcesses: number[] = [];
  const responseTime = new Map<number, number>();

  while (remaining.length > 0) {
    const available = remaining.filter(p => p.arrivalTime <= currentTime);

    if (available.length === 0) {
      const nextArrival = Math.min(...remaining.map(p => p.arrivalTime));
      steps.push({
        step: steps.length,
        currentTime,
        runningProcess: null,
        readyQueue: [],
        completedProcesses: [...completedProcesses],
        explanation: `CPU idle, waiting for next process at time ${nextArrival}`
      });
      currentTime = nextArrival;
      continue;
    }

    // Select process with highest priority (lowest priority number)
    const highestPriority = available.reduce((min, p) =>
      (p.priority ?? 0) < (min.priority ?? 0) ? p : min
    );
    const index = remaining.findIndex(p => p.id === highestPriority.id);
    remaining.splice(index, 1);

    responseTime.set(highestPriority.id, currentTime - highestPriority.arrivalTime);

    const startTime = currentTime;
    const endTime = currentTime + highestPriority.burstTime;

    const ganttSegment: GanttSegment = {
      processId: highestPriority.id,
      processName: highestPriority.name,
      startTime,
      endTime
    };
    ganttChart.push(ganttSegment);

    steps.push({
      step: steps.length,
      currentTime: startTime,
      runningProcess: highestPriority.id,
      readyQueue: available.filter(p => p.id !== highestPriority.id).map(p => p.id),
      completedProcesses: [...completedProcesses],
      ganttSegment,
      explanation: `Process ${highestPriority.name} selected (priority: ${highestPriority.priority}, burst: ${highestPriority.burstTime})`
    });

    currentTime = endTime;
    completedProcesses.push(highestPriority.id);

    steps.push({
      step: steps.length,
      currentTime,
      runningProcess: null,
      readyQueue: remaining.filter(p => p.arrivalTime <= currentTime).map(p => p.id),
      completedProcesses: [...completedProcesses],
      explanation: `Process ${highestPriority.name} completed at time ${currentTime}`
    });

    processMetrics.push({
      processId: highestPriority.id,
      processName: highestPriority.name,
      arrivalTime: highestPriority.arrivalTime,
      burstTime: highestPriority.burstTime,
      completionTime: endTime,
      turnaroundTime: endTime - highestPriority.arrivalTime,
      waitingTime: endTime - highestPriority.arrivalTime - highestPriority.burstTime,
      responseTime: responseTime.get(highestPriority.id)!
    });
  }

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

/**
 * Preemptive Priority Scheduling
 */
function runPreemptivePriority(processes: Process[]): SchedulingResult {
  const steps: SchedulingStep[] = [];
  const ganttChart: GanttSegment[] = [];
  const processMetrics: ProcessMetrics[] = [];

  const remaining = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
  let currentTime = 0;
  const completedProcesses: number[] = [];
  const responseTime = new Map<number, number>();
  let currentProcess: typeof remaining[0] | null = null;

  const maxTime = Math.max(...processes.map(p => p.arrivalTime)) + processes.reduce((sum, p) => sum + p.burstTime, 0);

  while (completedProcesses.length < processes.length && currentTime <= maxTime) {
    const available = remaining.filter(p => p.arrivalTime <= currentTime && p.remainingTime! > 0);

    if (available.length === 0) {
      currentTime++;
      continue;
    }

    const highestPriority = available.reduce((min, p) =>
      (p.priority ?? 0) < (min.priority ?? 0) ? p : min
    );

    if (!responseTime.has(highestPriority.id)) {
      responseTime.set(highestPriority.id, currentTime - highestPriority.arrivalTime);
    }

    if (currentProcess?.id !== highestPriority.id) {
      steps.push({
        step: steps.length,
        currentTime,
        runningProcess: highestPriority.id,
        readyQueue: available.filter(p => p.id !== highestPriority.id).map(p => p.id),
        completedProcesses: [...completedProcesses],
        explanation: `Process ${highestPriority.name} selected (priority: ${highestPriority.priority}, remaining: ${highestPriority.remainingTime})`
      });
    }

    currentProcess = highestPriority;
    highestPriority.remainingTime!--;
    currentTime++;

    if (ganttChart.length === 0 || ganttChart[ganttChart.length - 1].processId !== highestPriority.id) {
      ganttChart.push({
        processId: highestPriority.id,
        processName: highestPriority.name,
        startTime: currentTime - 1,
        endTime: currentTime
      });
    } else {
      ganttChart[ganttChart.length - 1].endTime = currentTime;
    }

    if (highestPriority.remainingTime === 0) {
      completedProcesses.push(highestPriority.id);

      processMetrics.push({
        processId: highestPriority.id,
        processName: highestPriority.name,
        arrivalTime: highestPriority.arrivalTime,
        burstTime: highestPriority.burstTime,
        completionTime: currentTime,
        turnaroundTime: currentTime - highestPriority.arrivalTime,
        waitingTime: currentTime - highestPriority.arrivalTime - highestPriority.burstTime,
        responseTime: responseTime.get(highestPriority.id)!
      });

      steps.push({
        step: steps.length,
        currentTime,
        runningProcess: null,
        readyQueue: available.filter(p => p.remainingTime! > 0).map(p => p.id),
        completedProcesses: [...completedProcesses],
        explanation: `Process ${highestPriority.name} completed at time ${currentTime}`
      });
    }
  }

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

import type { Process, SchedulingResult, SchedulingStep, GanttSegment, ProcessMetrics } from './types';

/**
 * SJF (Shortest Job First) CPU Scheduling Algorithm
 *
 * @param processes - Array of processes to schedule
 * @param preemptive - Whether to use preemptive (SRTF) or non-preemptive SJF
 * @returns Complete execution trace with steps and metrics
 */
export function runSJF(processes: Process[], preemptive: boolean = false): SchedulingResult {
  if (preemptive) {
    return runSRTF(processes);
  }
  return runNonPreemptiveSJF(processes);
}

/**
 * Non-preemptive SJF
 */
function runNonPreemptiveSJF(processes: Process[]): SchedulingResult {
  const steps: SchedulingStep[] = [];
  const ganttChart: GanttSegment[] = [];
  const processMetrics: ProcessMetrics[] = [];

  const remaining = [...processes];
  let currentTime = 0;
  const completedProcesses: number[] = [];
  const responseTime = new Map<number, number>();

  while (remaining.length > 0) {
    // Find processes that have arrived
    const available = remaining.filter(p => p.arrivalTime <= currentTime);

    if (available.length === 0) {
      // CPU idle
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

    // Select process with shortest burst time
    const shortest = available.reduce((min, p) => p.burstTime < min.burstTime ? p : min);
    const index = remaining.findIndex(p => p.id === shortest.id);
    remaining.splice(index, 1);

    responseTime.set(shortest.id, currentTime - shortest.arrivalTime);

    const startTime = currentTime;
    const endTime = currentTime + shortest.burstTime;

    const ganttSegment: GanttSegment = {
      processId: shortest.id,
      processName: shortest.name,
      startTime,
      endTime
    };
    ganttChart.push(ganttSegment);

    steps.push({
      step: steps.length,
      currentTime: startTime,
      runningProcess: shortest.id,
      readyQueue: available.filter(p => p.id !== shortest.id).map(p => p.id),
      completedProcesses: [...completedProcesses],
      ganttSegment,
      explanation: `Process ${shortest.name} selected (shortest burst time: ${shortest.burstTime})`
    });

    currentTime = endTime;
    completedProcesses.push(shortest.id);

    steps.push({
      step: steps.length,
      currentTime,
      runningProcess: null,
      readyQueue: remaining.filter(p => p.arrivalTime <= currentTime).map(p => p.id),
      completedProcesses: [...completedProcesses],
      explanation: `Process ${shortest.name} completed at time ${currentTime}`
    });

    const completionTime = endTime;
    const turnaroundTime = completionTime - shortest.arrivalTime;
    const waitingTime = turnaroundTime - shortest.burstTime;

    processMetrics.push({
      processId: shortest.id,
      processName: shortest.name,
      arrivalTime: shortest.arrivalTime,
      burstTime: shortest.burstTime,
      completionTime,
      turnaroundTime,
      waitingTime,
      responseTime: responseTime.get(shortest.id)!
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
 * Preemptive SJF (SRTF - Shortest Remaining Time First)
 */
function runSRTF(processes: Process[]): SchedulingResult {
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
      if (currentProcess) {
        ganttChart.push({
          processId: currentProcess.id,
          processName: currentProcess.name,
          startTime: currentTime - 1,
          endTime: currentTime
        });
      }
      currentTime++;
      continue;
    }

    const shortest = available.reduce((min, p) => p.remainingTime! < min.remainingTime! ? p : min);

    if (!responseTime.has(shortest.id)) {
      responseTime.set(shortest.id, currentTime - shortest.arrivalTime);
    }

    if (currentProcess?.id !== shortest.id) {
      steps.push({
        step: steps.length,
        currentTime,
        runningProcess: shortest.id,
        readyQueue: available.filter(p => p.id !== shortest.id).map(p => p.id),
        completedProcesses: [...completedProcesses],
        explanation: `Process ${shortest.name} selected (remaining time: ${shortest.remainingTime})`
      });
    }

    currentProcess = shortest;
    shortest.remainingTime!--;
    currentTime++;

    if (ganttChart.length === 0 || ganttChart[ganttChart.length - 1].processId !== shortest.id) {
      ganttChart.push({
        processId: shortest.id,
        processName: shortest.name,
        startTime: currentTime - 1,
        endTime: currentTime
      });
    } else {
      ganttChart[ganttChart.length - 1].endTime = currentTime;
    }

    if (shortest.remainingTime === 0) {
      completedProcesses.push(shortest.id);

      const completionTime = currentTime;
      const turnaroundTime = completionTime - shortest.arrivalTime;
      const waitingTime = turnaroundTime - shortest.burstTime;

      processMetrics.push({
        processId: shortest.id,
        processName: shortest.name,
        arrivalTime: shortest.arrivalTime,
        burstTime: shortest.burstTime,
        completionTime,
        turnaroundTime,
        waitingTime,
        responseTime: responseTime.get(shortest.id)!
      });

      steps.push({
        step: steps.length,
        currentTime,
        runningProcess: null,
        readyQueue: available.filter(p => p.remainingTime! > 0).map(p => p.id),
        completedProcesses: [...completedProcesses],
        explanation: `Process ${shortest.name} completed at time ${currentTime}`
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

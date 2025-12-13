import type { Process, SchedulingResult, SchedulingStep, GanttSegment, ProcessMetrics } from './types';

/**
 * Round Robin CPU Scheduling Algorithm
 *
 * Each process gets a fixed time quantum in circular order.
 * Preemptive algorithm with time slicing.
 *
 * @param processes - Array of processes to schedule
 * @param timeQuantum - Time quantum for each process
 * @returns Complete execution trace with steps and metrics
 */
export function runRoundRobin(processes: Process[], timeQuantum: number): SchedulingResult {
  const steps: SchedulingStep[] = [];
  const ganttChart: GanttSegment[] = [];
  const processMetrics: ProcessMetrics[] = [];

  const remaining = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
  const readyQueue: typeof remaining = [];
  let currentTime = 0;
  const completedProcesses: number[] = [];
  const responseTime = new Map<number, number>();

  // Add processes that arrive at time 0
  remaining
    .filter(p => p.arrivalTime === 0)
    .forEach(p => readyQueue.push(p));

  while (completedProcesses.length < processes.length) {
    if (readyQueue.length === 0) {
      // CPU idle - find next arriving process
      const nextArrival = remaining
        .filter(p => p.remainingTime! > 0 && p.arrivalTime > currentTime)
        .reduce((min, p) => p.arrivalTime < min.arrivalTime ? p : min, remaining[0]);

      if (nextArrival && nextArrival.arrivalTime > currentTime) {
        steps.push({
          step: steps.length,
          currentTime,
          runningProcess: null,
          readyQueue: [],
          completedProcesses: [...completedProcesses],
          explanation: `CPU idle, waiting for next process at time ${nextArrival.arrivalTime}`
        });
        currentTime = nextArrival.arrivalTime;

        // Add newly arrived processes
        remaining
          .filter(p => p.arrivalTime === currentTime && p.remainingTime! > 0)
          .forEach(p => {
            if (!readyQueue.includes(p)) readyQueue.push(p);
          });
      }
      continue;
    }

    // Get next process from ready queue
    const currentProcess = readyQueue.shift()!;

    // Record response time (first time process gets CPU)
    if (!responseTime.has(currentProcess.id)) {
      responseTime.set(currentProcess.id, currentTime - currentProcess.arrivalTime);
    }

    // Calculate execution time (min of quantum and remaining time)
    const executionTime = Math.min(timeQuantum, currentProcess.remainingTime!);
    const startTime = currentTime;
    const endTime = currentTime + executionTime;

    // Add to gantt chart
    ganttChart.push({
      processId: currentProcess.id,
      processName: currentProcess.name,
      startTime,
      endTime
    });

    steps.push({
      step: steps.length,
      currentTime: startTime,
      runningProcess: currentProcess.id,
      readyQueue: readyQueue.map(p => p.id),
      completedProcesses: [...completedProcesses],
      explanation: `Process ${currentProcess.name} executes for ${executionTime} time units (quantum: ${timeQuantum}, remaining: ${currentProcess.remainingTime})`
    });

    currentProcess.remainingTime! -= executionTime;
    currentTime = endTime;

    // Add newly arrived processes to ready queue
    remaining
      .filter(p =>
        p.arrivalTime > startTime &&
        p.arrivalTime <= currentTime &&
        p.remainingTime! > 0 &&
        !readyQueue.includes(p) &&
        p.id !== currentProcess.id
      )
      .forEach(p => readyQueue.push(p));

    // Check if process completed
    if (currentProcess.remainingTime === 0) {
      completedProcesses.push(currentProcess.id);

      const completionTime = currentTime;
      const turnaroundTime = completionTime - currentProcess.arrivalTime;
      const waitingTime = turnaroundTime - currentProcess.burstTime;

      processMetrics.push({
        processId: currentProcess.id,
        processName: currentProcess.name,
        arrivalTime: currentProcess.arrivalTime,
        burstTime: currentProcess.burstTime,
        completionTime,
        turnaroundTime,
        waitingTime,
        responseTime: responseTime.get(currentProcess.id)!
      });

      steps.push({
        step: steps.length,
        currentTime,
        runningProcess: null,
        readyQueue: readyQueue.map(p => p.id),
        completedProcesses: [...completedProcesses],
        explanation: `Process ${currentProcess.name} completed at time ${currentTime}`
      });
    } else {
      // Process not finished - add back to ready queue
      readyQueue.push(currentProcess);

      steps.push({
        step: steps.length,
        currentTime,
        runningProcess: null,
        readyQueue: readyQueue.map(p => p.id),
        completedProcesses: [...completedProcesses],
        explanation: `Process ${currentProcess.name} preempted (remaining: ${currentProcess.remainingTime}), added to ready queue`
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

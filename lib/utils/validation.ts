/**
 * Input validation utilities for algorithm inputs
 */

/**
 * Validate page reference string
 * @param input - Comma-separated page numbers
 * @returns Array of page numbers or error message
 */
export function validatePageReferenceString(
  input: string
): { valid: boolean; pages?: number[]; error?: string } {
  if (!input.trim()) {
    return { valid: false, error: 'Page reference string cannot be empty' };
  }

  const parts = input.split(',').map((s) => s.trim());
  const pages: number[] = [];

  for (const part of parts) {
    const num = parseInt(part, 10);
    if (isNaN(num) || num < 0) {
      return { valid: false, error: `Invalid page number: ${part}` };
    }
    pages.push(num);
  }

  if (pages.length === 0) {
    return { valid: false, error: 'Page reference string must contain at least one page' };
  }

  return { valid: true, pages };
}

/**
 * Validate number of frames
 */
export function validateFrameCount(
  count: number
): { valid: boolean; error?: string } {
  if (count < 1) {
    return { valid: false, error: 'Number of frames must be at least 1' };
  }
  if (count > 10) {
    return { valid: false, error: 'Number of frames cannot exceed 10 for visualization clarity' };
  }
  return { valid: true };
}

/**
 * Validate disk request queue
 * @param input - Comma-separated track numbers
 * @param diskSize - Total number of tracks
 */
export function validateDiskRequests(
  input: string,
  diskSize: number
): { valid: boolean; requests?: number[]; error?: string } {
  if (!input.trim()) {
    return { valid: false, error: 'Request queue cannot be empty' };
  }

  const parts = input.split(',').map((s) => s.trim());
  const requests: number[] = [];

  for (const part of parts) {
    const num = parseInt(part, 10);
    if (isNaN(num) || num < 0 || num >= diskSize) {
      return {
        valid: false,
        error: `Invalid track number: ${part} (must be 0-${diskSize - 1})`
      };
    }
    requests.push(num);
  }

  if (requests.length === 0) {
    return { valid: false, error: 'Request queue must contain at least one request' };
  }

  return { valid: true, requests };
}

/**
 * Validate process inputs for CPU scheduling
 */
export interface ProcessInput {
  arrivalTime: number;
  burstTime: number;
  priority?: number;
}

export function validateProcessInputs(
  processes: ProcessInput[]
): { valid: boolean; error?: string } {
  if (processes.length === 0) {
    return { valid: false, error: 'At least one process is required' };
  }

  if (processes.length > 10) {
    return { valid: false, error: 'Maximum 10 processes allowed for visualization clarity' };
  }

  for (let i = 0; i < processes.length; i++) {
    const process = processes[i];

    if (process.arrivalTime < 0) {
      return { valid: false, error: `Process ${i + 1}: Arrival time cannot be negative` };
    }

    if (process.burstTime <= 0) {
      return { valid: false, error: `Process ${i + 1}: Burst time must be positive` };
    }

    if (process.priority !== undefined && process.priority < 0) {
      return { valid: false, error: `Process ${i + 1}: Priority cannot be negative` };
    }
  }

  return { valid: true };
}

/**
 * Validate time quantum for Round Robin
 */
export function validateTimeQuantum(quantum: number): { valid: boolean; error?: string } {
  if (quantum <= 0) {
    return { valid: false, error: 'Time quantum must be positive' };
  }
  if (quantum > 100) {
    return { valid: false, error: 'Time quantum too large (max 100)' };
  }
  return { valid: true };
}

/**
 * Validate matrix for Banker's Algorithm
 */
export function validateBankersMatrix(
  allocation: number[][],
  max: number[][],
  available: number[]
): { valid: boolean; error?: string } {
  const processes = allocation.length;
  const resources = available.length;

  if (processes === 0) {
    return { valid: false, error: 'At least one process is required' };
  }

  if (resources === 0) {
    return { valid: false, error: 'At least one resource type is required' };
  }

  if (max.length !== processes) {
    return { valid: false, error: 'Allocation and Max matrices must have same number of processes' };
  }

  for (let i = 0; i < processes; i++) {
    if (allocation[i].length !== resources) {
      return { valid: false, error: `Allocation matrix row ${i + 1} has wrong number of resources` };
    }
    if (max[i].length !== resources) {
      return { valid: false, error: `Max matrix row ${i + 1} has wrong number of resources` };
    }

    for (let j = 0; j < resources; j++) {
      if (allocation[i][j] < 0 || max[i][j] < 0) {
        return { valid: false, error: 'Matrix values cannot be negative' };
      }
      if (allocation[i][j] > max[i][j]) {
        return {
          valid: false,
          error: `Process ${i + 1}: Allocated resources exceed maximum for resource ${j + 1}`
        };
      }
    }
  }

  for (let j = 0; j < resources; j++) {
    if (available[j] < 0) {
      return { valid: false, error: 'Available resources cannot be negative' };
    }
  }

  return { valid: true };
}

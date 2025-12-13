import type { AlgorithmInfo, AlgorithmCategory } from '@/types/algorithm';

/**
 * Metadata for all algorithms in the application
 * Used for navigation, display, and categorization
 */

export const pageReplacementAlgorithms: AlgorithmInfo[] = [
  {
    id: 'fifo',
    name: 'FIFO',
    category: 'page-replacement',
    description: 'First In First Out - Replaces the oldest page in memory',
    path: '/page-replacement/fifo',
    complexity: 'O(n)'
  },
  {
    id: 'lru',
    name: 'LRU',
    category: 'page-replacement',
    description: 'Least Recently Used - Replaces the page that has not been used for the longest time',
    path: '/page-replacement/lru',
    complexity: 'O(n)'
  },
  {
    id: 'optimal',
    name: 'Optimal',
    category: 'page-replacement',
    description: 'Replaces the page that will not be used for the longest time in the future',
    path: '/page-replacement/optimal',
    complexity: 'O(n²)'
  },
  {
    id: 'lfu',
    name: 'LFU',
    category: 'page-replacement',
    description: 'Least Frequently Used - Replaces the page with the lowest access frequency',
    path: '/page-replacement/lfu',
    complexity: 'O(n)'
  }
];

export const cpuSchedulingAlgorithms: AlgorithmInfo[] = [
  {
    id: 'fcfs',
    name: 'FCFS',
    category: 'cpu-scheduling',
    description: 'First Come First Serve - Processes execute in arrival order',
    path: '/cpu-scheduling/fcfs',
    complexity: 'O(n)'
  },
  {
    id: 'sjf',
    name: 'SJF',
    category: 'cpu-scheduling',
    description: 'Shortest Job First - Executes process with smallest burst time first',
    path: '/cpu-scheduling/sjf',
    complexity: 'O(n log n)'
  },
  {
    id: 'priority',
    name: 'Priority',
    category: 'cpu-scheduling',
    description: 'Schedules processes based on priority values',
    path: '/cpu-scheduling/priority',
    complexity: 'O(n log n)'
  },
  {
    id: 'round-robin',
    name: 'Round Robin',
    category: 'cpu-scheduling',
    description: 'Each process gets a fixed time quantum in circular order',
    path: '/cpu-scheduling/round-robin',
    complexity: 'O(n)'
  }
];

export const diskSchedulingAlgorithms: AlgorithmInfo[] = [
  {
    id: 'fcfs-disk',
    name: 'FCFS',
    category: 'disk-scheduling',
    description: 'Services disk requests in the order they arrive',
    path: '/disk-scheduling/fcfs',
    complexity: 'O(n)'
  },
  {
    id: 'sstf',
    name: 'SSTF',
    category: 'disk-scheduling',
    description: 'Shortest Seek Time First - Services nearest request first',
    path: '/disk-scheduling/sstf',
    complexity: 'O(n²)'
  },
  {
    id: 'scan',
    name: 'SCAN',
    category: 'disk-scheduling',
    description: 'Elevator algorithm - Services requests in one direction, then reverses',
    path: '/disk-scheduling/scan',
    complexity: 'O(n log n)'
  },
  {
    id: 'c-scan',
    name: 'C-SCAN',
    category: 'disk-scheduling',
    description: 'Circular SCAN - Services in one direction, then jumps to start',
    path: '/disk-scheduling/c-scan',
    complexity: 'O(n log n)'
  }
];

export const deadlockAlgorithms: AlgorithmInfo[] = [
  {
    id: 'bankers',
    name: "Banker's Algorithm",
    category: 'deadlock',
    description: 'Deadlock avoidance by checking for safe states',
    path: '/deadlock/bankers',
    complexity: 'O(m × n²)'
  },
  {
    id: 'rag',
    name: 'Resource Allocation Graph',
    category: 'deadlock',
    description: 'Deadlock detection using cycle detection in resource graphs',
    path: '/deadlock/rag',
    complexity: 'O(n²)'
  }
];

/**
 * All algorithms grouped by category
 */
export const allAlgorithms = {
  'page-replacement': pageReplacementAlgorithms,
  'cpu-scheduling': cpuSchedulingAlgorithms,
  'disk-scheduling': diskSchedulingAlgorithms,
  'deadlock': deadlockAlgorithms
} as const;

/**
 * Category metadata
 */
export interface CategoryInfo {
  id: AlgorithmCategory;
  name: string;
  description: string;
  icon: string;
  path: string;
}

export const categories: CategoryInfo[] = [
  {
    id: 'page-replacement',
    name: 'Page Replacement',
    description: 'Visualize how operating systems manage memory pages',
    icon: 'FileText',
    path: '/page-replacement'
  },
  {
    id: 'cpu-scheduling',
    name: 'CPU Scheduling',
    description: 'See how processes are scheduled for execution',
    icon: 'Settings',
    path: '/cpu-scheduling'
  },
  {
    id: 'disk-scheduling',
    name: 'Disk Scheduling',
    description: 'Understand how disk I/O requests are serviced',
    icon: 'HardDrive',
    path: '/disk-scheduling'
  },
  {
    id: 'deadlock',
    name: 'Deadlock Handling',
    description: 'Learn about deadlock detection and avoidance',
    icon: 'Lock',
    path: '/deadlock'
  }
];

/**
 * Get algorithm info by ID
 */
export function getAlgorithmById(id: string): AlgorithmInfo | undefined {
  return Object.values(allAlgorithms)
    .flat()
    .find((algo) => algo.id === id);
}

/**
 * Get all algorithms in a category
 */
export function getAlgorithmsByCategory(category: AlgorithmCategory): AlgorithmInfo[] {
  return allAlgorithms[category] || [];
}

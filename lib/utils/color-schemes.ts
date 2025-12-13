import type { ActionType } from '@/types/visualization';

/**
 * Color scheme utilities for consistent visualization styling
 */

/**
 * Get color class for an action type
 */
export function getActionColor(action: ActionType): string {
  const colorMap: Record<ActionType, string> = {
    success: 'bg-green-500 dark:bg-green-600',
    error: 'bg-red-500 dark:bg-red-600',
    warning: 'bg-yellow-500 dark:bg-yellow-600',
    active: 'bg-blue-500 dark:bg-blue-600',
    neutral: 'bg-zinc-400 dark:bg-zinc-600'
  };
  return colorMap[action];
}

/**
 * Get text color class for an action type
 */
export function getActionTextColor(action: ActionType): string {
  const colorMap: Record<ActionType, string> = {
    success: 'text-green-700 dark:text-green-400',
    error: 'text-red-700 dark:text-red-400',
    warning: 'text-yellow-700 dark:text-yellow-400',
    active: 'text-blue-700 dark:text-blue-400',
    neutral: 'text-zinc-700 dark:text-zinc-400'
  };
  return colorMap[action];
}

/**
 * Get border color class for an action type
 */
export function getActionBorderColor(action: ActionType): string {
  const colorMap: Record<ActionType, string> = {
    success: 'border-green-500 dark:border-green-600',
    error: 'border-red-500 dark:border-red-600',
    warning: 'border-yellow-500 dark:border-yellow-600',
    active: 'border-blue-500 dark:border-blue-600',
    neutral: 'border-zinc-400 dark:border-zinc-600'
  };
  return colorMap[action];
}

/**
 * Process colors for CPU scheduling visualization
 */
export const PROCESS_COLORS = [
  'bg-purple-500',   // Process 1
  'bg-pink-500',     // Process 2
  'bg-emerald-500',  // Process 3
  'bg-amber-500',    // Process 4
  'bg-cyan-500',     // Process 5
  'bg-indigo-500',   // Process 6+
  'bg-rose-500',
  'bg-teal-500',
  'bg-orange-500',
  'bg-violet-500'
];

/**
 * Get process color by index
 */
export function getProcessColor(index: number): string {
  return PROCESS_COLORS[index % PROCESS_COLORS.length];
}

/**
 * Get process text color by index
 */
export function getProcessTextColor(index: number): string {
  const textColors = [
    'text-purple-700 dark:text-purple-300',
    'text-pink-700 dark:text-pink-300',
    'text-emerald-700 dark:text-emerald-300',
    'text-amber-700 dark:text-amber-300',
    'text-cyan-700 dark:text-cyan-300',
    'text-indigo-700 dark:text-indigo-300',
    'text-rose-700 dark:text-rose-300',
    'text-teal-700 dark:text-teal-300',
    'text-orange-700 dark:text-orange-300',
    'text-violet-700 dark:text-violet-300'
  ];
  return textColors[index % textColors.length];
}

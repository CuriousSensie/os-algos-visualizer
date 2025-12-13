/**
 * Types related to visualization state and rendering
 */

/**
 * Visualization state types
 */
export type VisualizationState = 'idle' | 'playing' | 'paused' | 'completed';

/**
 * Action types for state visualizations (color-coded)
 */
export type ActionType = 'success' | 'error' | 'warning' | 'active' | 'neutral';

/**
 * Map action types to their semantic meanings
 */
export const ActionTypeMap = {
  success: 'Hit / Safe / Success',
  error: 'Fault / Deadlock / Error',
  warning: 'Waiting / Decision',
  active: 'Active / Executing',
  neutral: 'Idle / Empty'
} as const;

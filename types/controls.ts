/**
 * Types for animation and playback controls
 */

/**
 * Animation control interface
 * Provides play/pause/step/reset functionality for visualizations
 */
export interface AnimationControl {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number; // Animation speed multiplier (0.5x to 3x)
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
  goToStep: (step: number) => void;
}

/**
 * Speed presets for animation control
 */
export const SPEED_PRESETS = {
  SLOWEST: 0.5,
  SLOW: 0.75,
  NORMAL: 1,
  FAST: 1.5,
  FASTEST: 2,
  ULTRA_FAST: 3
} as const;

/**
 * Base delay for animations (in milliseconds)
 * Actual delay = BASE_ANIMATION_DELAY / speed
 */
export const BASE_ANIMATION_DELAY = 1000;

/**
 * Animation configuration constants
 * Centralized animation timing and behavior settings
 */

/**
 * Base animation delay in milliseconds
 * Actual delay = BASE_ANIMATION_DELAY / speed
 */
export const BASE_ANIMATION_DELAY = 1000;

/**
 * Speed presets for quick selection
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
 * Minimum and maximum speed multipliers
 */
export const MIN_SPEED = 0.5;
export const MAX_SPEED = 3;

/**
 * Framer Motion animation variants
 */
export const fadeInVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export const slideInVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const scaleInVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

/**
 * Transition presets for Framer Motion
 */
export const springTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30
};

export const easeTransition = {
  type: 'tween' as const,
  duration: 0.3,
  ease: 'easeInOut' as const
};

/**
 * Stagger delay for multiple items
 */
export const STAGGER_DELAY = 0.05;

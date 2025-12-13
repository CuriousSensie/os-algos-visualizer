'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { AnimationControl } from '@/types/controls';
import { BASE_ANIMATION_DELAY } from '@/types/controls';

/**
 * Custom hook for managing animation playback controls
 * Provides play/pause/step/reset functionality for algorithm visualizations
 *
 * @param totalSteps - Total number of steps in the animation
 * @param onStepChange - Optional callback fired when the current step changes
 * @returns Animation control interface
 */
export function useAnimationControl(
  totalSteps: number,
  onStepChange?: (step: number) => void
): AnimationControl {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1); // Default 1x speed
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance to next step when playing
  useEffect(() => {
    if (!isPlaying || currentStep >= totalSteps - 1) {
      // Stop playing if we reach the end
      if (currentStep >= totalSteps - 1 && isPlaying) {
        setIsPlaying(false);
      }
      return;
    }

    const delay = BASE_ANIMATION_DELAY / speed;
    timerRef.current = setTimeout(() => {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange?.(nextStep);
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentStep, speed, totalSteps, onStepChange]);

  const play = useCallback(() => {
    if (currentStep >= totalSteps - 1) {
      // If at the end, reset to beginning
      setCurrentStep(0);
      onStepChange?.(0);
    }
    setIsPlaying(true);
  }, [currentStep, totalSteps, onStepChange]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  const stepForward = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange?.(nextStep);
      setIsPlaying(false);
    }
  }, [currentStep, totalSteps, onStepChange]);

  const stepBackward = useCallback(() => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onStepChange?.(prevStep);
      setIsPlaying(false);
    }
  }, [currentStep, onStepChange]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    onStepChange?.(0);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, [onStepChange]);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
      onStepChange?.(step);
      setIsPlaying(false);
    }
  }, [totalSteps, onStepChange]);

  const handleSetSpeed = useCallback((newSpeed: number) => {
    // Clamp speed between 0.5x and 3x
    const clampedSpeed = Math.min(Math.max(newSpeed, 0.5), 3);
    setSpeed(clampedSpeed);
  }, []);

  return {
    isPlaying,
    currentStep,
    totalSteps,
    speed,
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
    setSpeed: handleSetSpeed,
    goToStep
  };
}

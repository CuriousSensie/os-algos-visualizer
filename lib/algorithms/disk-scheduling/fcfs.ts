import type { DiskSchedulingResult, DiskSchedulingStep } from './types';

/**
 * FCFS (First Come First Serve) Disk Scheduling
 * Services requests in the order they arrive
 */
export function runDiskFCFS(
  initialPosition: number,
  requestQueue: number[]
): DiskSchedulingResult {
  const steps: DiskSchedulingStep[] = [];
  const seekSequence: number[] = [initialPosition];
  let currentPosition = initialPosition;
  let totalSeekTime = 0;

  requestQueue.forEach((track, index) => {
    const seekDistance = Math.abs(track - currentPosition);
    totalSeekTime += seekDistance;

    steps.push({
      step: index,
      currentPosition,
      targetTrack: track,
      seekDistance,
      explanation: `Moving from track ${currentPosition} to ${track}, seek distance: ${seekDistance}`
    });

    currentPosition = track;
    seekSequence.push(track);
  });

  return {
    steps,
    seekSequence,
    totalSeekTime,
    averageSeekTime: totalSeekTime / requestQueue.length
  };
}

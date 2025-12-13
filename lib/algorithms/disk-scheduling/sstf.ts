import type { DiskSchedulingResult, DiskSchedulingStep } from './types';

/**
 * SSTF (Shortest Seek Time First) Disk Scheduling
 * Services the request closest to the current head position
 */
export function runSSTF(
  initialPosition: number,
  requestQueue: number[]
): DiskSchedulingResult {
  const steps: DiskSchedulingStep[] = [];
  const seekSequence: number[] = [initialPosition];
  const remaining = [...requestQueue];
  let currentPosition = initialPosition;
  let totalSeekTime = 0;

  while (remaining.length > 0) {
    // Find closest track
    let closestIndex = 0;
    let minDistance = Math.abs(remaining[0] - currentPosition);

    for (let i = 1; i < remaining.length; i++) {
      const distance = Math.abs(remaining[i] - currentPosition);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    const targetTrack = remaining[closestIndex];
    const seekDistance = Math.abs(targetTrack - currentPosition);
    totalSeekTime += seekDistance;

    steps.push({
      step: steps.length,
      currentPosition,
      targetTrack,
      seekDistance,
      explanation: `Moving from track ${currentPosition} to ${targetTrack} (closest), seek distance: ${seekDistance}`
    });

    currentPosition = targetTrack;
    seekSequence.push(targetTrack);
    remaining.splice(closestIndex, 1);
  }

  return {
    steps,
    seekSequence,
    totalSeekTime,
    averageSeekTime: totalSeekTime / requestQueue.length
  };
}

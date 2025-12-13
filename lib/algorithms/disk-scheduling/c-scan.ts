import type { DiskSchedulingResult, DiskSchedulingStep, Direction } from './types';

/**
 * C-SCAN (Circular SCAN) Disk Scheduling Algorithm
 * Head moves in one direction, then jumps to the other end and continues
 */
export function runCSCAN(
  initialPosition: number,
  requestQueue: number[],
  diskSize: number,
  initialDirection: Direction = 'right'
): DiskSchedulingResult {
  const steps: DiskSchedulingStep[] = [];
  const seekSequence: number[] = [initialPosition];
  let currentPosition = initialPosition;
  let totalSeekTime = 0;

  // Split requests into left and right of current position
  const leftRequests = requestQueue.filter(track => track < currentPosition).sort((a, b) => a - b);
  const rightRequests = requestQueue.filter(track => track >= currentPosition).sort((a, b) => a - b);

  const serviceRequests = (requests: number[], dir: Direction) => {
    requests.forEach(track => {
      const seekDistance = Math.abs(track - currentPosition);
      totalSeekTime += seekDistance;

      steps.push({
        step: steps.length,
        currentPosition,
        targetTrack: track,
        seekDistance,
        direction: dir,
        explanation: `Moving ${dir} from track ${currentPosition} to ${track}, seek distance: ${seekDistance}`
      });

      currentPosition = track;
      seekSequence.push(track);
    });
  };

  if (initialDirection === 'right') {
    // Service right requests
    serviceRequests(rightRequests, 'right');

    // Move to end
    if (leftRequests.length > 0) {
      const seekToEnd = diskSize - 1 - currentPosition;
      if (seekToEnd > 0) {
        totalSeekTime += seekToEnd;
        steps.push({
          step: steps.length,
          currentPosition,
          targetTrack: diskSize - 1,
          seekDistance: seekToEnd,
          direction: 'right',
          explanation: `Moving to end of disk (track ${diskSize - 1}), seek distance: ${seekToEnd}`
        });
        currentPosition = diskSize - 1;
      }

      // Jump to beginning
      const jumpDistance = currentPosition;
      totalSeekTime += jumpDistance;
      steps.push({
        step: steps.length,
        currentPosition,
        targetTrack: 0,
        seekDistance: jumpDistance,
        direction: 'right',
        explanation: `Jumping to beginning of disk (track 0), seek distance: ${jumpDistance}`
      });
      currentPosition = 0;

      // Service left requests
      serviceRequests(leftRequests, 'right');
    }
  } else {
    // Service left requests (in reverse)
    serviceRequests(leftRequests.reverse(), 'left');

    // Move to beginning
    if (rightRequests.length > 0) {
      const seekToBegin = currentPosition;
      if (seekToBegin > 0) {
        totalSeekTime += seekToBegin;
        steps.push({
          step: steps.length,
          currentPosition,
          targetTrack: 0,
          seekDistance: seekToBegin,
          direction: 'left',
          explanation: `Moving to beginning of disk (track 0), seek distance: ${seekToBegin}`
        });
        currentPosition = 0;
      }

      // Jump to end
      const jumpDistance = diskSize - 1;
      totalSeekTime += jumpDistance;
      steps.push({
        step: steps.length,
        currentPosition,
        targetTrack: diskSize - 1,
        seekDistance: jumpDistance,
        direction: 'left',
        explanation: `Jumping to end of disk (track ${diskSize - 1}), seek distance: ${jumpDistance}`
      });
      currentPosition = diskSize - 1;

      // Service right requests (in reverse)
      serviceRequests(rightRequests.reverse(), 'left');
    }
  }

  return {
    steps,
    seekSequence,
    totalSeekTime,
    averageSeekTime: totalSeekTime / requestQueue.length
  };
}

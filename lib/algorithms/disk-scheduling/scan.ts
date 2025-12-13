import type { DiskSchedulingResult, DiskSchedulingStep, Direction } from './types';

/**
 * SCAN (Elevator) Disk Scheduling Algorithm
 * Head moves in one direction servicing requests, then reverses
 */
export function runSCAN(
  initialPosition: number,
  requestQueue: number[],
  diskSize: number,
  initialDirection: Direction = 'right'
): DiskSchedulingResult {
  const steps: DiskSchedulingStep[] = [];
  const seekSequence: number[] = [initialPosition];
  let currentPosition = initialPosition;
  let totalSeekTime = 0;
  let direction = initialDirection;

  // Split requests into left and right of current position
  const leftRequests = requestQueue.filter(track => track < currentPosition).sort((a, b) => b - a);
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

  if (direction === 'right') {
    // Service right requests
    serviceRequests(rightRequests, 'right');

    // Move to end if there are left requests
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

      // Reverse direction
      direction = 'left';
      serviceRequests(leftRequests, 'left');
    }
  } else {
    // Service left requests
    serviceRequests(leftRequests, 'left');

    // Move to beginning if there are right requests
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

      // Reverse direction
      direction = 'right';
      serviceRequests(rightRequests, 'right');
    }
  }

  return {
    steps,
    seekSequence,
    totalSeekTime,
    averageSeekTime: totalSeekTime / requestQueue.length
  };
}

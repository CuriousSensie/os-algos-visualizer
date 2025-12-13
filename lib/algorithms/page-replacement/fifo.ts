import type { PageReplacementResult, PageReplacementStep } from './types';

/**
 * FIFO (First In First Out) Page Replacement Algorithm
 *
 * Replaces the oldest page in memory (the one that arrived first).
 * Uses a queue to track the order of pages.
 *
 * @param pageRequests - Array of page numbers to be accessed
 * @param numFrames - Number of memory frames available
 * @returns Complete execution trace with steps and metrics
 */
export function runFIFO(
  pageRequests: number[],
  numFrames: number
): PageReplacementResult {
  const steps: PageReplacementStep[] = [];
  const frames: (number | null)[] = Array(numFrames).fill(null);
  const fifoQueue: number[] = []; // Track order of page insertion
  let pageFaults = 0;
  let pageHits = 0;

  pageRequests.forEach((page, index) => {
    // Check if page is already in a frame (page hit)
    const frameIndex = frames.indexOf(page);

    if (frameIndex !== -1) {
      // Page hit
      pageHits++;
      steps.push({
        step: index,
        currentPage: page,
        frames: [...frames],
        action: 'hit',
        hitFrameIndex: frameIndex,
        explanation: `Page ${page} found in frame ${frameIndex} (Page Hit)`
      });
    } else {
      // Page fault
      pageFaults++;

      // Find empty frame or replace oldest page
      const emptyFrameIndex = frames.indexOf(null);

      if (emptyFrameIndex !== -1) {
        // Empty frame available
        frames[emptyFrameIndex] = page;
        fifoQueue.push(page);

        steps.push({
          step: index,
          currentPage: page,
          frames: [...frames],
          action: 'miss',
          explanation: `Page ${page} loaded into empty frame ${emptyFrameIndex} (Page Fault)`
        });
      } else {
        // Replace oldest page (FIFO)
        const oldestPage = fifoQueue.shift()!;
        const replaceIndex = frames.indexOf(oldestPage);
        frames[replaceIndex] = page;
        fifoQueue.push(page);

        steps.push({
          step: index,
          currentPage: page,
          frames: [...frames],
          action: 'replace',
          replacedPage: oldestPage,
          replacedFrameIndex: replaceIndex,
          explanation: `Page ${page} replaced page ${oldestPage} in frame ${replaceIndex} (Page Fault - FIFO)`
        });
      }
    }
  });

  return {
    steps,
    totalPageFaults: pageFaults,
    totalHits: pageHits,
    hitRatio: pageHits / pageRequests.length,
    missRatio: pageFaults / pageRequests.length
  };
}

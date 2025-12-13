import type { PageReplacementResult, PageReplacementStep } from './types';

/**
 * Optimal Page Replacement Algorithm
 *
 * Replaces the page that will not be used for the longest time in the future.
 * This is a theoretical algorithm (requires future knowledge) used as a benchmark.
 *
 * @param pageRequests - Array of page numbers to be accessed
 * @param numFrames - Number of memory frames available
 * @returns Complete execution trace with steps and metrics
 */
export function runOptimal(
  pageRequests: number[],
  numFrames: number
): PageReplacementResult {
  const steps: PageReplacementStep[] = [];
  const frames: (number | null)[] = Array(numFrames).fill(null);
  let pageFaults = 0;
  let pageHits = 0;

  /**
   * Find when a page will be used next (or return Infinity if not used again)
   */
  const findNextUse = (page: number, currentIndex: number): number => {
    for (let i = currentIndex + 1; i < pageRequests.length; i++) {
      if (pageRequests[i] === page) {
        return i;
      }
    }
    return Infinity; // Page will not be used again
  };

  pageRequests.forEach((page, index) => {
    // Check if page is already in a frame
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

      // Find empty frame or replace optimal page
      const emptyFrameIndex = frames.indexOf(null);

      if (emptyFrameIndex !== -1) {
        // Empty frame available
        frames[emptyFrameIndex] = page;

        steps.push({
          step: index,
          currentPage: page,
          frames: [...frames],
          action: 'miss',
          explanation: `Page ${page} loaded into empty frame ${emptyFrameIndex} (Page Fault)`
        });
      } else {
        // Find page that will be used farthest in the future
        let optimalPage = frames[0]!;
        let farthestUse = findNextUse(optimalPage, index);

        for (const framePage of frames) {
          if (framePage !== null) {
            const nextUse = findNextUse(framePage, index);
            if (nextUse > farthestUse) {
              farthestUse = nextUse;
              optimalPage = framePage;
            }
          }
        }

        const replaceIndex = frames.indexOf(optimalPage);
        frames[replaceIndex] = page;

        steps.push({
          step: index,
          currentPage: page,
          frames: [...frames],
          action: 'replace',
          replacedPage: optimalPage,
          replacedFrameIndex: replaceIndex,
          explanation: farthestUse === Infinity
            ? `Page ${page} replaced page ${optimalPage} (won't be used again) in frame ${replaceIndex} (Page Fault)`
            : `Page ${page} replaced page ${optimalPage} (used farthest in future) in frame ${replaceIndex} (Page Fault)`
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

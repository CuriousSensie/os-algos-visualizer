import type { PageReplacementResult, PageReplacementStep } from './types';

/**
 * LRU (Least Recently Used) Page Replacement Algorithm
 *
 * Replaces the page that has not been used for the longest time.
 * Tracks when each page was last accessed.
 *
 * @param pageRequests - Array of page numbers to be accessed
 * @param numFrames - Number of memory frames available
 * @returns Complete execution trace with steps and metrics
 */
export function runLRU(
  pageRequests: number[],
  numFrames: number
): PageReplacementResult {
  const steps: PageReplacementStep[] = [];
  const frames: (number | null)[] = Array(numFrames).fill(null);
  const lastUsed = new Map<number, number>(); // page -> last access time
  let pageFaults = 0;
  let pageHits = 0;

  pageRequests.forEach((page, index) => {
    // Check if page is already in a frame
    const frameIndex = frames.indexOf(page);

    if (frameIndex !== -1) {
      // Page hit - update last used time
      pageHits++;
      lastUsed.set(page, index);

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

      // Find empty frame or replace LRU page
      const emptyFrameIndex = frames.indexOf(null);

      if (emptyFrameIndex !== -1) {
        // Empty frame available
        frames[emptyFrameIndex] = page;
        lastUsed.set(page, index);

        steps.push({
          step: index,
          currentPage: page,
          frames: [...frames],
          action: 'miss',
          explanation: `Page ${page} loaded into empty frame ${emptyFrameIndex} (Page Fault)`
        });
      } else {
        // Find LRU page (page with minimum last used time)
        let lruPage = frames[0]!;
        let lruTime = lastUsed.get(lruPage) ?? -1;

        for (const framePage of frames) {
          if (framePage !== null) {
            const time = lastUsed.get(framePage) ?? -1;
            if (time < lruTime) {
              lruTime = time;
              lruPage = framePage;
            }
          }
        }

        const replaceIndex = frames.indexOf(lruPage);
        frames[replaceIndex] = page;
        lastUsed.set(page, index);

        steps.push({
          step: index,
          currentPage: page,
          frames: [...frames],
          action: 'replace',
          replacedPage: lruPage,
          replacedFrameIndex: replaceIndex,
          explanation: `Page ${page} replaced LRU page ${lruPage} in frame ${replaceIndex} (Page Fault)`
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

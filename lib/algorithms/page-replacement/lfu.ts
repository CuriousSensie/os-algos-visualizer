import type { PageReplacementResult, PageReplacementStep } from './types';

/**
 * LFU (Least Frequently Used) Page Replacement Algorithm
 *
 * Replaces the page with the lowest access frequency.
 * If multiple pages have the same frequency, uses FIFO as tiebreaker.
 *
 * @param pageRequests - Array of page numbers to be accessed
 * @param numFrames - Number of memory frames available
 * @returns Complete execution trace with steps and metrics
 */
export function runLFU(
  pageRequests: number[],
  numFrames: number
): PageReplacementResult {
  const steps: PageReplacementStep[] = [];
  const frames: (number | null)[] = Array(numFrames).fill(null);
  const frequency = new Map<number, number>(); // page -> access count
  const insertionOrder = new Map<number, number>(); // page -> insertion time (for FIFO tiebreaker)
  let pageFaults = 0;
  let pageHits = 0;

  pageRequests.forEach((page, index) => {
    // Check if page is already in a frame
    const frameIndex = frames.indexOf(page);

    if (frameIndex !== -1) {
      // Page hit - increment frequency
      pageHits++;
      frequency.set(page, (frequency.get(page) ?? 0) + 1);

      steps.push({
        step: index,
        currentPage: page,
        frames: [...frames],
        action: 'hit',
        hitFrameIndex: frameIndex,
        explanation: `Page ${page} found in frame ${frameIndex}, frequency: ${frequency.get(page)} (Page Hit)`
      });
    } else {
      // Page fault
      pageFaults++;

      // Find empty frame or replace LFU page
      const emptyFrameIndex = frames.indexOf(null);

      if (emptyFrameIndex !== -1) {
        // Empty frame available
        frames[emptyFrameIndex] = page;
        frequency.set(page, 1);
        insertionOrder.set(page, index);

        steps.push({
          step: index,
          currentPage: page,
          frames: [...frames],
          action: 'miss',
          explanation: `Page ${page} loaded into empty frame ${emptyFrameIndex}, frequency: 1 (Page Fault)`
        });
      } else {
        // Find LFU page (lowest frequency, with FIFO tiebreaker)
        let lfuPage = frames[0]!;
        let minFreq = frequency.get(lfuPage) ?? 0;
        let earliestTime = insertionOrder.get(lfuPage) ?? 0;

        for (const framePage of frames) {
          if (framePage !== null) {
            const freq = frequency.get(framePage) ?? 0;
            const time = insertionOrder.get(framePage) ?? 0;

            // Replace if frequency is lower, or same frequency but inserted earlier (FIFO)
            if (freq < minFreq || (freq === minFreq && time < earliestTime)) {
              minFreq = freq;
              earliestTime = time;
              lfuPage = framePage;
            }
          }
        }

        const replaceIndex = frames.indexOf(lfuPage);
        const oldFreq = frequency.get(lfuPage) ?? 0;

        frames[replaceIndex] = page;
        frequency.set(page, 1);
        insertionOrder.set(page, index);

        steps.push({
          step: index,
          currentPage: page,
          frames: [...frames],
          action: 'replace',
          replacedPage: lfuPage,
          replacedFrameIndex: replaceIndex,
          explanation: `Page ${page} replaced LFU page ${lfuPage} (freq: ${oldFreq}) in frame ${replaceIndex} (Page Fault)`
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

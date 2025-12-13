'use client';

import { useState, useMemo } from 'react';
import { AlgorithmSelector } from '@/components/comparison/AlgorithmSelector';
import { ComparisonView } from '@/components/comparison/ComparisonView';
import { ComparisonMetrics } from '@/components/comparison/ComparisonMetrics';
import { VisualizationContainer } from '@/components/visualizers/shared/VisualizationContainer';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import type { AlgorithmCategory } from '@/lib/utils/comparison';
import {
  extractPageReplacementMetrics,
  extractCPUSchedulingMetrics,
  extractDiskSchedulingMetrics,
} from '@/lib/utils/comparison';

// Page Replacement
import { runFIFO } from '@/lib/algorithms/page-replacement/fifo';
import { runLRU } from '@/lib/algorithms/page-replacement/lru';
import { runOptimal } from '@/lib/algorithms/page-replacement/optimal';
import { runLFU } from '@/lib/algorithms/page-replacement/lfu';
import { PageReplacementInputs } from '@/components/visualizers/page-replacement/PageReplacementInputs';
import type { PageReplacementResult } from '@/lib/algorithms/page-replacement/types';

// CPU Scheduling
import { runFCFS } from '@/lib/algorithms/cpu-scheduling/fcfs';
import { runSJF } from '@/lib/algorithms/cpu-scheduling/sjf';
import { runPriority } from '@/lib/algorithms/cpu-scheduling/priority';
import { runRoundRobin } from '@/lib/algorithms/cpu-scheduling/round-robin';
import { SchedulingInputs } from '@/components/visualizers/cpu-scheduling/SchedulingInputs';
import type { SchedulingResult, Process } from '@/lib/algorithms/cpu-scheduling/types';

// Disk Scheduling
import { runDiskFCFS } from '@/lib/algorithms/disk-scheduling/fcfs';
import { runSSTF } from '@/lib/algorithms/disk-scheduling/sstf';
import { runSCAN } from '@/lib/algorithms/disk-scheduling/scan';
import { runCSCAN } from '@/lib/algorithms/disk-scheduling/c-scan';
import { DiskInputs } from '@/components/visualizers/disk-scheduling/DiskInputs';
import type { DiskSchedulingResult, Direction } from '@/lib/algorithms/disk-scheduling/types';

export default function ComparePage() {
  const [selectedCategory, setSelectedCategory] = useState<AlgorithmCategory | null>(null);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([]);
  const [inputs, setInputs] = useState<Record<string, unknown>>({});
  const [showComparison, setShowComparison] = useState(false);

  // CPU scheduling specific state
  const [quantum, setQuantum] = useState(2);
  const [isPreemptive, setIsPreemptive] = useState(false);

  const handleCompare = (category: AlgorithmCategory, algorithms: string[]) => {
    setSelectedCategory(category);
    setSelectedAlgorithms(algorithms);
    setShowComparison(false);

    // Set default inputs based on category
    if (category === 'page-replacement') {
      setInputs({
        pageRequests: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2],
        numFrames: 3,
      });
    } else if (category === 'cpu-scheduling') {
      setInputs({
        processes: [
          { id: 1, arrivalTime: 0, burstTime: 5, priority: 2 },
          { id: 2, arrivalTime: 1, burstTime: 3, priority: 1 },
          { id: 3, arrivalTime: 2, burstTime: 8, priority: 3 },
          { id: 4, arrivalTime: 3, burstTime: 6, priority: 2 },
        ],
      });
      setQuantum(2);
      setIsPreemptive(false);
    } else if (category === 'disk-scheduling') {
      setInputs({
        initialPosition: 50,
        requests: [82, 170, 43, 140, 24, 16, 190],
        diskSize: 200,
        direction: 'right' as Direction,
      });
    }
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedAlgorithms([]);
    setInputs({});
    setShowComparison(false);
    setQuantum(2);
    setIsPreemptive(false);
  };

  const handleInputsSubmit = (newInputs: Record<string, unknown>) => {
    setInputs(newInputs);
    setShowComparison(true);
  };

  const results = useMemo(() => {
    if (!selectedCategory || !showComparison) return new Map();

    const resultsMap = new Map<
      string,
      PageReplacementResult | SchedulingResult | DiskSchedulingResult
    >();

    if (selectedCategory === 'page-replacement') {
      const { pageRequests, numFrames } = inputs as {
        pageRequests: number[];
        numFrames: number;
      };

      selectedAlgorithms.forEach((algorithm) => {
        let result: PageReplacementResult;
        switch (algorithm) {
          case 'fifo':
            result = runFIFO(pageRequests, numFrames);
            break;
          case 'lru':
            result = runLRU(pageRequests, numFrames);
            break;
          case 'optimal':
            result = runOptimal(pageRequests, numFrames);
            break;
          case 'lfu':
            result = runLFU(pageRequests, numFrames);
            break;
          default:
            return;
        }
        resultsMap.set(algorithm.toUpperCase(), result);
      });
    } else if (selectedCategory === 'cpu-scheduling') {
      const { processes } = inputs as {
        processes: Process[];
      };

      selectedAlgorithms.forEach((algorithm) => {
        let result: SchedulingResult;
        switch (algorithm) {
          case 'fcfs':
            result = runFCFS(processes);
            break;
          case 'sjf':
            result = runSJF(processes, isPreemptive);
            break;
          case 'priority':
            result = runPriority(processes, isPreemptive);
            break;
          case 'round-robin':
            result = runRoundRobin(processes, quantum);
            break;
          default:
            return;
        }
        resultsMap.set(algorithm.toUpperCase(), result);
      });
    } else if (selectedCategory === 'disk-scheduling') {
      const { initialPosition, requests, diskSize, direction } = inputs as {
        initialPosition: number;
        requests: number[];
        diskSize: number;
        direction: Direction;
      };

      selectedAlgorithms.forEach((algorithm) => {
        let result: DiskSchedulingResult;
        switch (algorithm) {
          case 'fcfs':
            result = runDiskFCFS(initialPosition, requests);
            break;
          case 'sstf':
            result = runSSTF(initialPosition, requests);
            break;
          case 'scan':
            result = runSCAN(initialPosition, requests, diskSize, direction);
            break;
          case 'c-scan':
            result = runCSCAN(initialPosition, requests, diskSize, direction);
            break;
          default:
            return;
        }
        resultsMap.set(algorithm.toUpperCase(), result);
      });
    }

    return resultsMap;
  }, [selectedCategory, selectedAlgorithms, inputs, showComparison, quantum, isPreemptive]);

  const metrics = useMemo(() => {
    if (!selectedCategory || results.size === 0) return [];

    if (selectedCategory === 'page-replacement') {
      return extractPageReplacementMetrics(
        results as Map<string, PageReplacementResult>
      );
    } else if (selectedCategory === 'cpu-scheduling') {
      return extractCPUSchedulingMetrics(results as Map<string, SchedulingResult>);
    } else {
      return extractDiskSchedulingMetrics(results as Map<string, DiskSchedulingResult>);
    }
  }, [selectedCategory, results]);

  return (
    <VisualizationContainer
      title="Algorithm Comparison"
      description="Compare multiple algorithms side-by-side with the same input"
    >
      <div className="space-y-6">
        {!selectedCategory ? (
          <AlgorithmSelector onCompare={handleCompare} />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <Button onClick={handleReset} variant="secondary" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Change Selection
              </Button>
            </div>

            {!showComparison ? (
              <div className="max-w-2xl mx-auto">
                {selectedCategory === 'page-replacement' && (
                  <PageReplacementInputs
                    initialPageRequests={inputs.pageRequests as number[]}
                    initialNumFrames={inputs.numFrames as number}
                    onSubmit={(pageRequests, numFrames) =>
                      handleInputsSubmit({ pageRequests, numFrames })
                    }
                  />
                )}
                {selectedCategory === 'cpu-scheduling' && (
                  <div className="space-y-4">
                    {(selectedAlgorithms.includes('sjf') ||
                      selectedAlgorithms.includes('priority')) && (
                      <div className="flex gap-2">
                        <Button
                          variant={!isPreemptive ? 'primary' : 'secondary'}
                          onClick={() => setIsPreemptive(false)}
                        >
                          Non-preemptive
                        </Button>
                        <Button
                          variant={isPreemptive ? 'primary' : 'secondary'}
                          onClick={() => setIsPreemptive(true)}
                        >
                          Preemptive
                        </Button>
                      </div>
                    )}
                    <SchedulingInputs
                      initialProcesses={inputs.processes as Process[]}
                      initialQuantum={quantum}
                      showQuantum={selectedAlgorithms.includes('round-robin')}
                      showPriority={selectedAlgorithms.includes('priority')}
                      onQuantumChange={(q) => setQuantum(q)}
                      onSubmit={(processes) => handleInputsSubmit({ processes })}
                    />
                  </div>
                )}
                {selectedCategory === 'disk-scheduling' && (
                  <DiskInputs
                    initialPosition={inputs.initialPosition as number}
                    initialRequests={inputs.requests as number[]}
                    initialDiskSize={inputs.diskSize as number}
                    initialDirection={inputs.direction as Direction}
                    showDirection={
                      selectedAlgorithms.includes('scan') ||
                      selectedAlgorithms.includes('c-scan')
                    }
                    onSubmit={(pos, req, size, dir) =>
                      handleInputsSubmit({
                        initialPosition: pos,
                        requests: req,
                        diskSize: size,
                        direction: dir,
                      })
                    }
                  />
                )}
              </div>
            ) : (
              <>
                <ComparisonView
                  category={selectedCategory}
                  results={results}
                  inputs={
                    selectedCategory === 'cpu-scheduling'
                      ? { ...inputs, quantum, isPreemptive }
                      : inputs
                  }
                />
                <ComparisonMetrics category={selectedCategory} metrics={metrics} />
              </>
            )}
          </>
        )}
      </div>
    </VisualizationContainer>
  );
}

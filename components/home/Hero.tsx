import { Cpu } from 'lucide-react';

/**
 * Hero section for the home page
 */
export function Hero() {
  return (
    <div className="text-center mb-16">
      <div className="flex justify-center mb-6">
        <Cpu className="w-20 h-20 text-blue-600 dark:text-blue-500" />
      </div>
      <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-500 mb-4">
        OS Algorithm Visualizer
      </h1>
      <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
        Interactive visualizations of operating system algorithms.
        See how page replacement, CPU scheduling, disk scheduling, and deadlock handling work step-by-step.
      </p>
    </div>
  );
}

import { Hero } from '@/components/home/Hero';
import { AlgorithmCard } from '@/components/home/AlgorithmCard';
import { categories, allAlgorithms } from '@/lib/constants/algorithm-metadata';
import { Play, Sliders, BarChart3 } from 'lucide-react';

/**
 * Home page - Main dashboard
 */
export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Hero />

      {/* Features */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <Play className="w-12 h-12 text-blue-600 dark:text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            Step-by-Step Visualization
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Watch algorithms execute one step at a time with detailed explanations
          </p>
        </div>

        <div className="text-center">
          <div className="flex justify-center mb-3">
            <Sliders className="w-12 h-12 text-blue-600 dark:text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            Interactive Controls
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Play, pause, step forward/backward, and adjust animation speed
          </p>
        </div>

        <div className="text-center">
          <div className="flex justify-center mb-3">
            <BarChart3 className="w-12 h-12 text-blue-600 dark:text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            Real-time Metrics
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            See performance metrics update live as the algorithm runs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category) => (
          <AlgorithmCard
            key={category.id}
            category={category}
            algorithmCount={allAlgorithms[category.id].length}
          />
        ))}
      </div>
    </div>
  );
}

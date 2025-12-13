'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { CATEGORY_ALGORITHMS, type AlgorithmCategory } from '@/lib/utils/comparison';
import { Check } from 'lucide-react';

interface AlgorithmSelectorProps {
  onCompare: (category: AlgorithmCategory, selectedAlgorithms: string[]) => void;
}

export function AlgorithmSelector({ onCompare }: AlgorithmSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<AlgorithmCategory>('page-replacement');
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([]);

  const handleAlgorithmToggle = (algorithmId: string) => {
    setSelectedAlgorithms((prev) => {
      if (prev.includes(algorithmId)) {
        return prev.filter((id) => id !== algorithmId);
      } else if (prev.length < 3) {
        return [...prev, algorithmId];
      }
      return prev;
    });
  };

  const handleCategoryChange = (category: AlgorithmCategory) => {
    setSelectedCategory(category);
    setSelectedAlgorithms([]);
  };

  const handleCompare = () => {
    if (selectedAlgorithms.length >= 2) {
      onCompare(selectedCategory, selectedAlgorithms);
    }
  };

  const categories: { id: AlgorithmCategory; name: string; description: string }[] = [
    {
      id: 'page-replacement',
      name: 'Page Replacement',
      description: 'Compare page fault rates and hit ratios',
    },
    {
      id: 'cpu-scheduling',
      name: 'CPU Scheduling',
      description: 'Compare waiting and turnaround times',
    },
    {
      id: 'disk-scheduling',
      name: 'Disk Scheduling',
      description: 'Compare seek times and disk head movement',
    },
  ];

  return (
    <Card variant="bordered">
      <CardHeader>
        <CardTitle>Select Algorithms to Compare</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
            Algorithm Category
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                }`}
              >
                <div className="font-medium text-zinc-900 dark:text-zinc-100">
                  {category.name}
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  {category.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Algorithm Selection */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
            Select 2-3 Algorithms
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CATEGORY_ALGORITHMS[selectedCategory].map((algorithm) => {
              const isSelected = selectedAlgorithms.includes(algorithm.id);
              const isDisabled = !isSelected && selectedAlgorithms.length >= 3;

              return (
                <button
                  key={algorithm.id}
                  onClick={() => handleAlgorithmToggle(algorithm.id)}
                  disabled={isDisabled}
                  className={`p-4 rounded-lg border-2 transition-all text-left relative ${
                    isSelected
                      ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
                      : isDisabled
                      ? 'border-zinc-200 dark:border-zinc-700 opacity-50 cursor-not-allowed'
                      : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">
                        {algorithm.name}
                      </div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                        {algorithm.fullName}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-green-600 dark:text-green-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Compare Button */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-700">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            {selectedAlgorithms.length < 2
              ? `Select at least 2 algorithms (${selectedAlgorithms.length}/3 selected)`
              : `${selectedAlgorithms.length}/3 algorithms selected`}
          </div>
          <Button
            onClick={handleCompare}
            disabled={selectedAlgorithms.length < 2}
            variant="primary"
          >
            Compare Algorithms
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

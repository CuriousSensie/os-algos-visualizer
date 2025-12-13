import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { diskSchedulingAlgorithms } from '@/lib/constants/algorithm-metadata';
import { ArrowRight } from 'lucide-react';

/**
 * Disk Scheduling category hub page
 */
export default function DiskSchedulingHub() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
          Disk Scheduling Algorithms
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Visualize how disk I/O requests are optimized to minimize seek time and improve performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {diskSchedulingAlgorithms.map((algorithm) => (
          <Link key={algorithm.id} href={algorithm.path}>
            <Card variant="bordered" className="hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
              <CardHeader>
                <CardTitle>{algorithm.name}</CardTitle>
                <CardDescription>{algorithm.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500 dark:text-zinc-500">
                    Complexity: {algorithm.complexity}
                  </span>
                  <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { ArrowRight, FileText, Settings, HardDrive, Lock, LucideIcon } from 'lucide-react';
import type { CategoryInfo } from '@/lib/constants/algorithm-metadata';

interface AlgorithmCardProps {
  category: CategoryInfo;
  algorithmCount: number;
}

// Map icon names to actual icon components
const iconMap: Record<string, LucideIcon> = {
  FileText,
  Settings,
  HardDrive,
  Lock,
};

/**
 * Category card for the home page
 */
export function AlgorithmCard({ category, algorithmCount }: AlgorithmCardProps) {
  const IconComponent = iconMap[category.icon] || FileText;
  return (
    <Link href={category.path}>
      <Card
        variant="bordered"
        className="hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer h-full"
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-3">
                <IconComponent className="w-12 h-12 text-blue-600 dark:text-blue-500" />
              </div>
              <CardTitle className="text-2xl">{category.name}</CardTitle>
              <CardDescription className="mt-2 text-base">
                {category.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {algorithmCount} {algorithmCount === 1 ? 'algorithm' : 'algorithms'}
            </span>
            <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-500" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

import { ReactNode } from 'react';

interface VisualizationContainerProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

/**
 * Main container for visualization pages
 * Provides consistent layout across all algorithm visualizers
 */
export function VisualizationContainer({
  children,
  title,
  description
}: VisualizationContainerProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {(title || description) && (
        <div className="mb-8">
          {title && (
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

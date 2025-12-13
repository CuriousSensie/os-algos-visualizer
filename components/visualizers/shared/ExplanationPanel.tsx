import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { ActionType } from '@/types/visualization';

interface ExplanationPanelProps {
  algorithmName: string;
  description: string;
  currentStepExplanation?: string;
  currentAction?: ActionType;
  pseudocode?: string[];
  activeLineIndex?: number;
  className?: string;
}

/**
 * Explanation panel showing algorithm details and current step info
 */
export function ExplanationPanel({
  algorithmName,
  description,
  currentStepExplanation,
  currentAction,
  pseudocode,
  activeLineIndex,
  className
}: ExplanationPanelProps) {
  return (
    <div className={className}>
      <Card variant="bordered" className="mb-4">
        <CardHeader>
          <CardTitle>{algorithmName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        </CardContent>
      </Card>

      {currentStepExplanation && (
        <Card variant="bordered" className="mb-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Current Step</CardTitle>
              {currentAction && <Badge variant={currentAction}>{currentAction}</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              {currentStepExplanation}
            </p>
          </CardContent>
        </Card>
      )}

      {pseudocode && pseudocode.length > 0 && (
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Pseudocode</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs font-mono">
              {pseudocode.map((line, index) => (
                <div
                  key={index}
                  className={`py-1 px-2 rounded ${
                    index === activeLineIndex
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300'
                      : 'text-zinc-700 dark:text-zinc-400'
                  }`}
                >
                  {line}
                </div>
              ))}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

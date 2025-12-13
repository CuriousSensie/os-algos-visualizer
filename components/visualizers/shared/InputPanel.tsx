import { ReactNode, FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface InputPanelProps {
  title?: string;
  children: ReactNode;
  onSubmit: () => void;
  submitLabel?: string;
  className?: string;
}

/**
 * Generic input panel wrapper for algorithm parameters
 */
export function InputPanel({
  title = 'Configuration',
  children,
  onSubmit,
  submitLabel = 'Run Algorithm',
  className
}: InputPanelProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Card variant="bordered" className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {children}
          <Button type="submit" variant="primary" className="w-full">
            {submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

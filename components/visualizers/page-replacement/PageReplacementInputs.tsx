'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { InputPanel } from '../shared/InputPanel';
import { validatePageReferenceString, validateFrameCount } from '@/lib/utils/validation';

interface PageReplacementInputsProps {
  initialPageRequests?: number[];
  initialNumFrames?: number;
  onSubmit: (pageRequests: number[], numFrames: number) => void;
  className?: string;
}

/**
 * Input form for page replacement algorithm parameters
 */
export function PageReplacementInputs({
  initialPageRequests = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2],
  initialNumFrames = 3,
  onSubmit,
  className
}: PageReplacementInputsProps) {
  const [pageString, setPageString] = useState(initialPageRequests.join(', '));
  const [numFrames, setNumFrames] = useState(initialNumFrames);
  const [pageError, setPageError] = useState('');
  const [frameError, setFrameError] = useState('');

  const handleSubmit = () => {
    // Validate page reference string
    const pageValidation = validatePageReferenceString(pageString);
    if (!pageValidation.valid) {
      setPageError(pageValidation.error || 'Invalid input');
      return;
    }
    setPageError('');

    // Validate frame count
    const frameValidation = validateFrameCount(numFrames);
    if (!frameValidation.valid) {
      setFrameError(frameValidation.error || 'Invalid input');
      return;
    }
    setFrameError('');

    // Submit valid data
    onSubmit(pageValidation.pages!, numFrames);
  };

  return (
    <InputPanel
      title="Configuration"
      onSubmit={handleSubmit}
      submitLabel="Run Algorithm"
      className={className}
    >
      <Input
        label="Page Reference String"
        type="text"
        value={pageString}
        onChange={(e) => setPageString(e.target.value)}
        placeholder="e.g., 7, 0, 1, 2, 0, 3, 0, 4"
        helperText="Comma-separated page numbers"
        error={pageError}
      />

      <Input
        label="Number of Frames"
        type="number"
        min={1}
        max={10}
        value={numFrames}
        onChange={(e) => setNumFrames(parseInt(e.target.value) || 1)}
        helperText="Number of memory frames (1-10)"
        error={frameError}
      />
    </InputPanel>
  );
}

'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { InputPanel } from '../shared/InputPanel';
import type { Direction } from '@/lib/algorithms/disk-scheduling/types';

interface DiskInputsProps {
  initialPosition?: number;
  initialRequests?: number[];
  initialDiskSize?: number;
  initialDirection?: Direction;
  onSubmit: (position: number, requests: number[], diskSize: number, direction: Direction) => void;
  showDirection?: boolean;
  className?: string;
}

/**
 * Input form for disk scheduling algorithms
 */
export function DiskInputs({
  initialPosition = 50,
  initialRequests = [82, 170, 43, 140, 24, 16, 190],
  initialDiskSize = 200,
  initialDirection = 'right',
  onSubmit,
  showDirection = false,
  className
}: DiskInputsProps) {
  const [position, setPosition] = useState(initialPosition);
  const [requestString, setRequestString] = useState(initialRequests.join(', '));
  const [diskSize, setDiskSize] = useState(initialDiskSize);
  const [direction, setDirection] = useState<Direction>(initialDirection);

  const handleSubmit = () => {
    const requests = requestString
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n) && n >= 0 && n < diskSize);

    onSubmit(position, requests, diskSize, direction);
  };

  return (
    <InputPanel title="Configuration" onSubmit={handleSubmit} className={className}>
      <Input
        label="Disk Size"
        type="number"
        min={50}
        max={500}
        value={diskSize}
        onChange={(e) => setDiskSize(parseInt(e.target.value) || 200)}
        helperText="Total number of tracks"
      />

      <Input
        label="Initial Head Position"
        type="number"
        min={0}
        max={diskSize - 1}
        value={position}
        onChange={(e) => setPosition(parseInt(e.target.value) || 0)}
      />

      <Input
        label="Request Queue"
        type="text"
        value={requestString}
        onChange={(e) => setRequestString(e.target.value)}
        placeholder="e.g., 82, 170, 43, 140"
        helperText="Comma-separated track numbers"
      />

      {showDirection && (
        <Select
          label="Initial Direction"
          value={direction}
          onChange={(e) => setDirection(e.target.value as Direction)}
        >
          <option value="right">Right (towards higher tracks)</option>
          <option value="left">Left (towards lower tracks)</option>
        </Select>
      )}
    </InputPanel>
  );
}

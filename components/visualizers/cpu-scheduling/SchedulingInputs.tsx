'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { Process } from '@/lib/algorithms/cpu-scheduling/types';
import { Plus, Trash2 } from 'lucide-react';

interface SchedulingInputsProps {
  initialProcesses?: Process[];
  onSubmit: (processes: Process[]) => void;
  showPriority?: boolean;
  showQuantum?: boolean;
  initialQuantum?: number;
  onQuantumChange?: (quantum: number) => void;
  className?: string;
}

/**
 * Input form for CPU scheduling algorithms
 */
export function SchedulingInputs({
  initialProcesses = [
    { id: 1, name: 'P1', arrivalTime: 0, burstTime: 5, priority: 2 },
    { id: 2, name: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
    { id: 3, name: 'P3', arrivalTime: 2, burstTime: 8, priority: 3 },
    { id: 4, name: 'P4', arrivalTime: 3, burstTime: 6, priority: 2 }
  ],
  onSubmit,
  showPriority = false,
  showQuantum = false,
  initialQuantum = 2,
  onQuantumChange,
  className
}: SchedulingInputsProps) {
  const [processes, setProcesses] = useState<Process[]>(initialProcesses);
  const [quantum, setQuantum] = useState(initialQuantum);

  const addProcess = () => {
    const newId = Math.max(...processes.map(p => p.id), 0) + 1;
    setProcesses([
      ...processes,
      { id: newId, name: `P${newId}`, arrivalTime: 0, burstTime: 1, priority: 1 }
    ]);
  };

  const removeProcess = (id: number) => {
    if (processes.length > 1) {
      setProcesses(processes.filter(p => p.id !== id));
    }
  };

  const updateProcess = (id: number, field: keyof Process, value: number) => {
    setProcesses(processes.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleSubmit = () => {
    onSubmit(processes);
    if (showQuantum && onQuantumChange) {
      onQuantumChange(quantum);
    }
  };

  return (
    <Card variant="bordered" className={className}>
      <CardHeader>
        <CardTitle>Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showQuantum && (
          <Input
            label="Time Quantum"
            type="number"
            min={1}
            value={quantum}
            onChange={(e) => setQuantum(parseInt(e.target.value) || 1)}
            helperText="Time slice for each process"
          />
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Processes
            </label>
            <Button size="sm" variant="ghost" onClick={addProcess}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {processes.map((process) => (
              <div key={process.id} className="flex gap-2 items-start p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Input
                    label="Arrival"
                    type="number"
                    min={0}
                    value={process.arrivalTime}
                    onChange={(e) => updateProcess(process.id, 'arrivalTime', parseInt(e.target.value) || 0)}
                  />
                  <Input
                    label="Burst"
                    type="number"
                    min={1}
                    value={process.burstTime}
                    onChange={(e) => updateProcess(process.id, 'burstTime', parseInt(e.target.value) || 1)}
                  />
                  {showPriority && (
                    <Input
                      label="Priority"
                      type="number"
                      min={0}
                      value={process.priority || 0}
                      onChange={(e) => updateProcess(process.id, 'priority', parseInt(e.target.value) || 0)}
                      helperText="Lower = higher priority"
                    />
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeProcess(process.id)}
                  disabled={processes.length === 1}
                  className="mt-6"
                >
                  <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleSubmit} variant="primary" className="w-full">
          Run Algorithm
        </Button>
      </CardContent>
    </Card>
  );
}

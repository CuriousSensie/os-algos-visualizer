'use client';

import { InputHTMLAttributes, useState, useEffect } from 'react';
import clsx from 'clsx';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
}

/**
 * Reusable Slider component for numeric input
 */
export function Slider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  showValue = true,
  valueFormatter = (v) => v.toString(),
  className,
  disabled,
  ...props
}: SliderProps) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setInternalValue(newValue);
    onChange(newValue);
  };

  // Calculate percentage for styling
  const percentage = ((internalValue - min) / (max - min)) * 100;

  return (
    <div className={clsx('w-full', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {valueFormatter(internalValue)}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={internalValue}
          onChange={handleChange}
          disabled={disabled}
          className={clsx(
            'w-full h-2 rounded-lg appearance-none cursor-pointer',
            'bg-zinc-200 dark:bg-zinc-700',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            // Custom slider thumb
            '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4',
            '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600',
            '[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform',
            '[&::-webkit-slider-thumb]:hover:scale-110',
            '[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:border-0',
            '[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:transition-transform',
            '[&::-moz-range-thumb]:hover:scale-110'
          )}
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, rgb(228 228 231) ${percentage}%, rgb(228 228 231) 100%)`
          }}
          {...props}
        />
      </div>
    </div>
  );
}

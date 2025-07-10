import React from 'react';
import { cn } from '@/lib/utils';

export type ProgressSize = 'sm' | 'md' | 'lg';
export type ProgressVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

export interface ProgressProps {
  value: number;
  max?: number;
  size?: ProgressSize;
  variant?: ProgressVariant;
  className?: string;
  showLabels?: boolean;
  labelPrefix?: string;
  labelSuffix?: string;
}

const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  className,
  showLabels = false,
  labelPrefix = '',
  labelSuffix = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeStyles = {
    sm: "h-1",
    md: "h-1.5",
    lg: "h-2.5",
  };

  const variantStyles = {
    default: "bg-gray-700",
    primary: "bg-indigo-600",
    success: "bg-green-600",
    warning: "bg-amber-600",
    danger: "bg-red-600",
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabels && (
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{labelPrefix}</span>
          <span>{value} of {max} {labelSuffix}</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full">
        <div 
          className={cn(
            "rounded-full",
            sizeStyles[size],
            variantStyles[variant],
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Progress; 
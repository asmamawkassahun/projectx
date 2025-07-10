import React from 'react';
import { cn } from '@/lib/utils';

export type StatusType = 'success' | 'warning' | 'error' | 'default' | 'info';

export interface StatusDotProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  pulsing?: boolean;
  className?: string;
}

const StatusDot: React.FC<StatusDotProps> = ({
  status,
  size = 'md',
  pulsing = false,
  className
}) => {
  const statusStyles = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    default: 'bg-gray-500',
    info: 'bg-blue-500'
  };

  const sizeStyles = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-3 w-3'
  };

  const pulseClass = pulsing ? 'animate-pulse' : '';

  return (
    <div className={cn(
      'rounded-full',
      statusStyles[status],
      sizeStyles[size],
      pulseClass,
      className
    )}></div>
  );
};

export default StatusDot; 
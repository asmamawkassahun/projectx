import React from 'react';
import { cn } from '@/lib/utils';

export type LoadingDotsSize = 'xs' | 'sm' | 'md';
export type LoadingDotsVariant = 'default' | 'primary' | 'white';

export interface LoadingDotsProps {
  size?: LoadingDotsSize;
  variant?: LoadingDotsVariant;
  className?: string;
  text?: string;
}

const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = 'sm',
  variant = 'default',
  className,
  text,
}) => {
  const sizeStyles = {
    xs: "h-1 w-1 mx-0.5",
    sm: "h-1.5 w-1.5 mx-0.5",
    md: "h-2 w-2 mx-1",
  };

  const variantStyles = {
    default: "bg-gray-500",
    primary: "bg-indigo-600",
    white: "bg-white",
  };

  const textStyles = {
    default: "text-gray-700",
    primary: "text-indigo-700",
    white: "text-white",
  };

  return (
    <div className={cn("flex items-center", className)}>
      {text && (
        <span className={cn("mr-2", textStyles[variant])}>
          {text}
        </span>
      )}
      <div className="flex items-center">
        <div 
          className={cn(
            "rounded-full animate-[bounce_1.4s_ease-in-out_infinite]",
            sizeStyles[size],
            variantStyles[variant],
          )}
          style={{ animationDelay: '0s' }}
        />
        <div 
          className={cn(
            "rounded-full animate-[bounce_1.4s_ease-in-out_infinite]",
            sizeStyles[size],
            variantStyles[variant],
          )}
          style={{ animationDelay: '0.2s' }}
        />
        <div 
          className={cn(
            "rounded-full animate-[bounce_1.4s_ease-in-out_infinite]",
            sizeStyles[size],
            variantStyles[variant],
          )}
          style={{ animationDelay: '0.4s' }}
        />
      </div>
    </div>
  );
};

export default LoadingDots; 